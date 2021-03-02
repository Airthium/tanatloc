import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Layout, Space, Steps, Tabs } from 'antd'
import {
  DownloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  RocketOutlined,
  StopOutlined
} from '@ant-design/icons'

import { Error } from '@/components/assets/notification'

import CloudServer from './cloudServer'

import SimulationAPI from '@/api/simulation'
import DownloadAPI from '@/api/download'

/**
 * Errors simulation/run
 * @memberof module:'src/components/project/simulation
 */
const errors = {
  runError: 'Unable to run the simulation',
  stopError: 'Unable to stop the simulation',
  updateError: 'Unable to update the simulation',
  downloadError: 'Unable to download the file'
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
  const [downloading, setDownloading] = useState([])

  const [configuration, setConfiguration] = useState(
    simulation?.scheme?.configuration
  )
  const [currentConfiguration, setCurrentConfiguration] = useState()

  // Data
  const [currentSimulation, { mutateSimulation }] = SimulationAPI.useSimulation(
    simulation?.id,
    2000
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
    if (!configuration?.run?.cloudServer) done = false
    setDisabled(!done)
  }, [configuration])

  useEffect(() => {
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
          method: 'set',
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
    try {
      await SimulationAPI.stop({ id: simulation.id })
    } catch (err) {
      Error(errors.stopError, err)
    }
  }

  /**
   * On log
   * @param {Object} task Task
   * @param {string} title Tab title
   */
  const onLog = (task, title) => {
    // Content
    const content = (
      <Tabs.TabPane tab={title}>
        <div
          dangerouslySetInnerHTML={{
            __html: task?.log?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />')
          }}
        />
      </Tabs.TabPane>
    )
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
      if (file) {
        await SimulationAPI.update({ id: simulation.id }, [
          {
            key: 'scheme',
            type: 'json',
            method: 'set',
            path: ['configuration', 'part'],
            value: file
          }
        ])
      } else {
        await SimulationAPI.update({ id: simulation.id }, [
          {
            key: 'scheme',
            type: 'json',
            method: 'erase',
            path: ['configuration', 'part']
          }
        ])
      }

      // Mutate
      mutateOneSimulation(currentSimulation)
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  const onArchiveDownload = async () => {
    setDownloading([...downloading, 'archive'])

    try {
      const archive = await DownloadAPI.get({ id: simulation.id }, null, true)
      const content = await archive.blob()

      const url = window.URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', simulation.scheme.name + '.zip')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      Error(errors.downloadError, err)
    } finally {
      const index = downloading.findIndex((d) => d === 'archive')
      setDownloading([
        ...downloading.slice(0, index),
        ...downloading.slice(index + 1)
      ])
    }
  }

  const onDownload = async (result) => {
    setDownloading([...downloading, result])

    try {
      const file = await DownloadAPI.get({ id: simulation.id }, result)
      const content = await file.text()

      const url = window.URL.createObjectURL(new Blob([content]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        result.name + '.' + result.fileName.split('.').pop()
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      Error(errors.downloadError, err)
    } finally {
      const index = downloading.findIndex((d) => d === result)
      setDownloading([
        ...downloading.slice(0, index),
        ...downloading.slice(index + 1)
      ])
    }
  }

  const resultFiles = []
  // console.log(currentConfiguration?.run?.resultsFilters)
  // console.log(currentConfiguration.parameters.time.children[1].default)
  // console.log(currentConfiguration?.run?.resultsFilters?.[0].multiplicator)
  // console.log(
  //   currentConfiguration?.[
  //     currentConfiguration?.run?.resultsFilters?.[0].multiplicator
  //   ]?.value ||
  //     currentConfiguration?.[
  //       currentConfiguration?.run?.resultsFilters?.[0].multiplicator
  //     ]?.default
  // )

  const selector = currentConfiguration?.run?.resultsFilters?.[0]?.multiplicator?.split(
    ','
  )
  console.log(selector)

  if (selector)
    console.log(
      currentConfiguration[selector]?.value ||
        currentConfiguration[selector]?.default
    )

  currentSimulation?.tasks?.forEach((task) => {
    if (task.file) resultFiles.push(task.file)
    if (task.files) resultFiles.push(...task.files)
  }) // TODO replace it

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
            disabled={running}
            cloudServer={currentConfiguration?.run?.cloudServer}
            onOk={onCloudServer}
          />
          <Card title="Run">
            <Space direction="vertical">
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
              <Steps direction="vertical">
                {currentSimulation?.tasks
                  ?.sort((a, b) => {
                    if (a.index === -1) return 1
                    if (b.index === -1) return -1
                    return a.index - b.index
                  })
                  .map((task, index) => {
                    return (
                      <Steps.Step
                        key={task}
                        title={task.label}
                        description={
                          <Button
                            icon={<FileTextOutlined />}
                            onClick={() => onLog(task, task.label)}
                            size="small"
                          />
                        }
                        subTitle={
                          '(' +
                          (index + 1) +
                          '/' +
                          currentSimulation.tasks.length +
                          ')'
                        }
                        status={task.status}
                      />
                    )
                  })}
              </Steps>
            </Space>
          </Card>

          {resultFiles.length ? (
            <Card
              title="Results"
              extra={
                <Button
                  loading={downloading.find((d) => d === 'archive')}
                  icon={<DownloadOutlined />}
                  onClick={onArchiveDownload}
                />
              }
            >
              <Space direction="vertical">
                {resultFiles.map((result) => {
                  return (
                    <Space key={result.name}>
                      <Button
                        icon={
                          currentConfiguration?.part?.fileName ===
                            result?.fileName &&
                          currentConfiguration?.part?.name === result?.name ? (
                            <EyeInvisibleOutlined />
                          ) : (
                            <EyeOutlined />
                          )
                        }
                        onClick={() =>
                          setPart(
                            currentConfiguration?.part?.fileName ===
                              result?.fileName &&
                              currentConfiguration?.part?.name === result?.name
                              ? null
                              : result
                          )
                        }
                      />
                      <Button
                        loading={downloading.find((d) => d === result)}
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={() => onDownload(result)}
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
