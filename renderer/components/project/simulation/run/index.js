import { useState, useEffect } from 'react'
import { message, Button, Card, Drawer, Layout, Space, Steps, Tabs } from 'antd'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  RocketOutlined
} from '@ant-design/icons'

import SimulationAPI from '../../../../../src/api/simulation'

import Sentry from '../../../../../src/lib/sentry'

/**
 * Errors simulation/run
 * @memberof module:renderer/components/project/simulation
 */
const errors = {
  runError: 'Unable to run the simulation',
  updateError: 'Unable to update the simulation'
}

/**
 * Run
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Run = ({ project, simulation }) => {
  // State
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
  const [currentSimulation] = SimulationAPI.useSimulation(simulation.id, 500)
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )

  // Check tasks
  useEffect(() => {
    const meshing = currentSimulation?.tasks?.filter((t) => t.type === 'mesh')
    setMeshingTasks(meshing)

    const simulating = currentSimulation?.tasks?.filter(
      (t) => t.type === 'simulation'
    )
    setSimulatingTasks(simulating)

    const runningTasks = currentSimulation?.tasks?.filter(
      (t) => t.status !== 'finish' && t.status !== 'error'
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
   * On run
   */
  const onRun = async () => {
    setRunning(true)

    SimulationAPI.run({ id: simulation.id }).catch((err) => {
      message.error(errors.runError)
      console.error(err)
      Sentry.captureException(err)
    })
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
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
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
          <Button icon={<RocketOutlined />} loading={running} onClick={onRun}>
            Run
          </Button>

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
