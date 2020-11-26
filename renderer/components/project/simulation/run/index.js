import { useState } from 'react'
import { message, Button, Drawer, Layout, Space, Steps, Tabs } from 'antd'
import { FileTextOutlined, PlusCircleOutlined } from '@ant-design/icons'

import SimulationAPI from '../../../../../src/api/simulation'

import Sentry from '../../../../../src/lib/sentry'

const Run = ({ project, simulation }) => {
  // State
  const [running, setRunning] = useState(false)
  const [logVisible, setLogVisible] = useState(false)
  const [logContent, setLogContent] = useState()

  // Data
  const [currentSimulation] = SimulationAPI.useSimulation(simulation.id)
  const meshingTasks = currentSimulation?.tasks?.filter(
    (t) => t.type === 'mesh'
  )
  const simulatingTasks = currentSimulation?.tasks?.filter(
    (t) => t.type === 'simulation'
  )

  /**
   * On run
   */
  const onRun = async () => {
    setRunning(true)

    try {
      await SimulationAPI.run({ id: simulation.id })
    } catch (err) {
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)
    } finally {
      setRunning(false)
    }
  }

  /**
   * On log
   * @param {Array} tasks Tasks
   */
  const onLog = (tasks) => {
    // Content
    const content = tasks.map((t, index) => (
      <Tabs.TabPane key={index} tab={'Mesh ' + (index + 1)}>
        <div
          dangerouslySetInnerHTML={{ __html: t.log.replace(/\n/g, '<br />') }}
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
            <Steps.Step
              title="Meshing"
              description={
                <Button
                  icon={
                    <FileTextOutlined onClick={() => onLog(meshingTasks)} />
                  }
                  size="small"
                />
              }
              subTitle={'(' + meshingTasks?.length + ')'}
              disabled={!meshingTasks?.length}
              status="finish"
            />
            <Steps.Step
              title="Simulating"
              description={
                <Button
                  icon={
                    <FileTextOutlined onClick={() => onLog(simulatingTasks)} />
                  }
                  size="small"
                />
              }
              subTitle={'(' + simulatingTasks?.length + ')'}
              disabled={!simulatingTasks?.length}
              status={'finish'}
            />
          </Steps>
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Run
