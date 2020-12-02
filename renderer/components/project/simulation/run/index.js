import { useState, useEffect } from 'react'
import { message, Button, Drawer, Layout, Space, Steps, Tabs } from 'antd'
import { FileTextOutlined, PlusCircleOutlined } from '@ant-design/icons'

import SimulationAPI from '../../../../../src/api/simulation'

import Sentry from '../../../../../src/lib/sentry'

const Run = ({ project, simulation }) => {
  // State
  const [running, setRunning] = useState(false)
  const [logVisible, setLogVisible] = useState(false)
  const [logContent, setLogContent] = useState()
  const [meshingTasks, setMeshingTasks] = useState()
  const [simulatingTasks, setSimulatingTasks] = useState()

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

    if (
      currentSimulation.scheme.configuration.run.done !==
        simulation.scheme.configuration.run.done ||
      currentSimulation.scheme.configuration.run.error !==
        simulation.scheme.configuration.run.error
    )
      mutateOneSimulation(currentSimulation)
  }, [JSON.stringify(currentSimulation)])

  /**
   * On run
   */
  const onRun = async () => {
    setRunning(true)

    SimulationAPI.run({ id: simulation.id }).catch((err) => {
      message.error(err.message)
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
          <Button
            icon={<PlusCircleOutlined />}
            loading={running}
            onClick={onRun}
          >
            Run
          </Button>

          <Steps direction="vertical">
            {meshingTasks?.map((task, index) => {
              return (
                <Steps.Step
                  key={task}
                  title="Meshing"
                  description={
                    <Button
                      icon={
                        <FileTextOutlined
                          onClick={() => onLog(meshingTasks, 'Mesh')}
                        />
                      }
                      size="small"
                    />
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
                      icon={
                        <FileTextOutlined
                          onClick={() => onLog(simulatingTasks, 'Simulation')}
                        />
                      }
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
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Run
