import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Layout, Space, Steps, Tabs } from 'antd'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  RocketOutlined,
  StopOutlined
} from '@ant-design/icons'

import { Error } from '@/components/assets/notification'

import CloudServer from './cloudServer'

import SimulationAPI from '@/api/simulation'

/**
 * Errors simulation/run
 * @memberof module:'src/components/project/simulation
 */
const errors = {
  runError: 'Unable to run the simulation',
  updateError: 'Unable to update the simulation'
}

/**
 * Run
 * @memberof module:'src/components/project/simulation
 * @param {Object} props Props
 */
const Run = ({ project, simulation }) => {
  // State
  const [disabled, setDisabled] = useState(false)
  const [running, setRunning] = useState(false)
  const [logVisible, setLogVisible] = useState(false)
  const [logContent, setLogContent] = useState()
  const [meshingTasks, setMeshingTasks] = useState()
  const [simulatingTasks, setSimulatingTasks] = useState()

  const [configuration, setConfiguration] = useState(
    simulation?.scheme?.configuration
  )
  const [currentConfiguration, setCurrentConfiguration] = useState()

  // Data
  const [currentSimulation, { mutateSimulation }] = SimulationAPI.useSimulation(
    simulation?.id,
    500
  )
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )

  // Check tasks
  useEffect(() => {
    let done = true
    configuration &&
      Object.keys(configuration).forEach((key) => {
        if (key !== 'part' && key !== 'run' && !configuration[key].done)
          done = false
      })
    if (!configuration.run.cloudServer) done = false
    setDisabled(!done)
  }, [configuration])

  useEffect(() => {
    const meshing = currentSimulation?.tasks?.filter((t) => t.type === 'mesh')
    setMeshingTasks(meshing)

    const simulating = currentSimulation?.tasks?.filter(
      (t) => t.type === 'simulation'
    )
    setSimulatingTasks(simulating)

    const runningTasks = currentSimulation?.tasks?.filter(
      (t) =>
        t.status !== 'finish' && t.status !== 'error' && t.status !== 'wait'
    )

    if (runningTasks?.length) setRunning(true)
    else setRunning(false)
  }, [JSON.stringify(currentSimulation)])

  useEffect(() => {
    setConfiguration(simulation?.scheme?.configuration)
  }, [JSON.stringify(simulation)])

  useEffect(() => {
    setCurrentConfiguration(currentSimulation?.scheme?.configuration)
  }, [JSON.stringify(currentSimulation)])

  useEffect(() => {
    if (
      currentConfiguration?.run.done !== configuration?.run.done ||
      currentConfiguration?.run.error !== configuration?.run.error
    )
      mutateOneSimulation(currentSimulation)
  }, [JSON.stringify(configuration), JSON.stringify(currentConfiguration)])

  /**
   * On cloud server
   * @param {Object} cloudServer Cloud server
   */
  const onCloudServer = async (cloudServer) => {
    try {
      // New simulation
      const newSimulation = { ...currentSimulation }

      // Update local
      configuration.run.cloudServer = cloudServer
      newSimulation.scheme.configuration = configuration

      // Update simulation
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'diff',
          path: ['configuration', 'run'],
          value: configuration.run
        }
      ])

      // Mutate
      mutateOneSimulation(currentSimulation)
      mutateSimulation(newSimulation)
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * On run
   */
  const onRun = async () => {
    setRunning(true)

    SimulationAPI.run({ id: simulation.id }).catch((err) => {
      Error(errors.runError, err)
    })
  }

  /**
   * On stop
   */
  const onStop = async () => {
    // TODO
  }

  /**
   * On log
   * @param {Array} tasks Tasks
   * @param {string} title Tabs title
   */
  const onLog = (tasks, title) => {
    // Content
    const content = tasks.map((t, index) => (
      <Tabs.TabPane key={index} tab={title + ' ' + (index + 1)}>
        <div
          dangerouslySetInnerHTML={{
            __html: t?.log?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />')
          }}
        />
      </Tabs.TabPane>
    ))
    setLogContent(<Tabs>{content}</Tabs>)

    // Open
    toggleLog()
  }

  /**
   * Toogle log visibility
   */
  const toggleLog = () => {
    setLogVisible(!logVisible)
  }

  /**
   * Set part
   * @param {Object} file File
   */
  const setPart = async (file) => {
    // Update local
    currentConfiguration.part = file

    try {
      // Update simulation
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'diff',
          path: ['configuration', 'part'],
          value: file
        }
      ])

      // Mutate
      mutateOneSimulation(currentSimulation)
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  const resultFiles = []
  simulatingTasks?.forEach((task) => {
    resultFiles.push(...(task.files || []))
  })

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Drawer
          title="Log"
          visible={logVisible}
          onClose={toggleLog}
          width={512}
        >
          {logContent}
        </Drawer>
        <Space direction="vertical">
          <CloudServer
            cloudServer={currentConfiguration?.run?.cloudServer}
            onOk={onCloudServer}
          />
          <Card>
            <Space>
              <Button
                disabled={disabled}
                icon={<RocketOutlined />}
                loading={running}
                onClick={onRun}
              >
                Run
              </Button>
              <Button
                disabled={!running}
                icon={<StopOutlined />}
                onClick={onStop}
              />
            </Space>
          </Card>

          <Steps direction="vertical">
            {meshingTasks?.map((task, index) => {
              return (
                <Steps.Step
                  key={task}
                  title="Meshing"
                  description={
                    <>
                      <Button
                        icon={<FileTextOutlined />}
                        onClick={() => onLog(meshingTasks, 'Mesh')}
                        size="small"
                      />
                      <Button
                        icon={
                          currentConfiguration.part?.fileName ===
                          task.file?.fileName ? (
                            <EyeInvisibleOutlined />
                          ) : (
                            <EyeOutlined />
                          )
                        }
                        size="small"
                        onClick={() =>
                          setPart(
                            currentConfiguration.part?.fileName ===
                              task.file?.fileName
                              ? null
                              : task.file
                          )
                        }
                      />
                    </>
                  }
                  subTitle={
                    '(' + (index + 1) + '/' + meshingTasks?.length + ')'
                  }
                  status={task.status}
                />
              )
            })}
            {simulatingTasks?.map((task, index) => {
              return (
                <Steps.Step
                  key={task}
                  title="Simulating"
                  description={
                    <Button
                      icon={<FileTextOutlined />}
                      onClick={() => onLog(simulatingTasks, 'Simulation')}
                      size="small"
                    />
                  }
                  subTitle={
                    '(' + (index + 1) + '/' + simulatingTasks?.length + ')'
                  }
                  status={task.status}
                />
              )
            })}
          </Steps>
          {resultFiles.length ? (
            <Card title="Results">
              <Space direction="vertical">
                {resultFiles.map((result) => {
                  return (
                    <Space key={result.name}>
                      <Button
                        icon={
                          currentConfiguration.part?.fileName ===
                            result?.fileName &&
                          currentConfiguration.part?.name === result?.name ? (
                            <EyeInvisibleOutlined />
                          ) : (
                            <EyeOutlined />
                          )
                        }
                        onClick={() =>
                          setPart(
                            currentConfiguration.part?.fileName ===
                              result?.fileName &&
                              currentConfiguration.part?.name === result?.name
                              ? null
                              : result
                          )
                        }
                      />
                      {result.name}
                    </Space>
                  )
                })}
              </Space>
            </Card>
          ) : null}
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Run
