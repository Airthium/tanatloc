import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Drawer,
  Layout,
  Modal,
  Select,
  Space,
  Spin,
  Steps,
  Tabs,
  Tooltip,
  Typography
} from 'antd'
import {
  DownloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  RocketOutlined,
  StopOutlined
} from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'

import CloudServer from './cloudServer'

import SimulationAPI from '@/api/simulation'
import ResultAPI from '@/api/result'

/**
 * Errors simulation/run
 * @memberof module:components/project/simulation
 */
const errors = {
  runError: 'Unable to run the simulation',
  stopError: 'Unable to stop the simulation',
  updateError: 'Unable to update the simulation',
  downloadError: 'Unable to download the file',
  logError: 'Unable to get system log'
}

/**
 * Run
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const Run = ({ simulation, result, setResult, swr }) => {
  // State
  const [disabled, setDisabled] = useState(false)
  const [running, setRunning] = useState(false)

  const [logVisible, setLogVisible] = useState(false)
  const [logContent, setLogContent] = useState()
  const [logLoading, setLogLoading] = useState(false)

  const [selectors, setSelectors] = useState([])
  const [selectorsCurrent, setSelectorsCurrent] = useState([])

  const [loadingResults, setLoadingResults] = useState(false)
  const [results, setResults] = useState([])
  const [steps, setSteps] = useState([])

  const [downloading, setDownloading] = useState([])

  // Data
  const [currentSimulation, { mutateSimulation }] = SimulationAPI.useSimulation(
    simulation?.id,
    2000
  )

  const configuration = simulation?.scheme?.configuration
  const currentConfiguration = currentSimulation?.scheme?.configuration

  // Check tasks
  useEffect(() => {
    if (!configuration) {
      setDisabled(true)
      return
    }

    let done = true
    Object.keys(configuration).forEach((key) => {
      if (key !== 'run' && !configuration[key].done) done = false
    })
    if (!configuration.run.cloudServer) done = false
    setDisabled(!done)
  }, [configuration])

  // Running
  useEffect(() => {
    if (!currentSimulation?.tasks) {
      setRunning(false)
      return
    }

    const erroredTasks = currentSimulation.tasks.filter(
      (t) => t.status === 'error'
    )
    if (erroredTasks.length) {
      setRunning(false)
      return
    }

    const runningTasks = currentSimulation.tasks.filter(
      (t) => t.status !== 'finish'
    )
    if (runningTasks.length) setRunning(true)
    else setRunning(false)
  }, [currentSimulation?.tasks])

  // Steps & Results
  useEffect(() => {
    if (!currentSimulation?.tasks) return

    setLoadingResults(true)

    const newSteps = []
    const newResults = []
    const newSelectors = []
    currentSimulation.tasks.forEach((task, index) => {
      // Steps
      newSteps[task.index] = {
        label: task.label,
        status: task.status,
        log: task.log,
        warning: task.warning,
        error: task.warning,
        systemLog: task.systemLog
      }

      // Results
      if (task.file) newResults.push(task.file)
      if (task.files) {
        // Filters
        const resultsFilters = configuration?.run?.resultsFilters

        if (resultsFilters) {
          //Sort by filters
          resultsFilters.forEach((filter, filterIndex) => {
            const pattern = new RegExp(filter.pattern)
            const filteredFiles = task.files.filter((file) =>
              pattern.test(file.fileName)
            )

            if (filteredFiles.length) {
              // Set iteration numbers
              const files = filteredFiles.map((file) => {
                const number = file.fileName
                  .replace(new RegExp(filter.prefixPattern), '')
                  .replace(new RegExp(filter.suffixPattern), '')
                return {
                  ...file,
                  number: +number
                }
              })

              // Sort
              files.sort((a, b) => a.number - b.number)

              // Get unique numbers
              const numbers = files
                .map((file) => file.number)
                .filter((value, i, self) => self.indexOf(value) === i)

              // Multiplicator
              let multiplicator

              const multiplicatorPath = filter.multiplicator
              if (multiplicatorPath) {
                const multiplicatorObject = multiplicatorPath.reduce(
                  (a, v) => a[v],
                  configuration
                )
                multiplicator =
                  multiplicatorObject.value || multiplicatorObject.default
              }

              // Set selector
              const resultIndex = newResults.length
              const selector = (
                <div key={filter}>
                  {filter.name}:{' '}
                  <Select
                    defaultValue={numbers[0]}
                    options={numbers.map((n, i) => ({
                      label: multiplicator ? n * multiplicator : i,
                      value: n
                    }))}
                    style={{ width: '100%' }}
                    value={
                      selectorsCurrent[filterIndex] &&
                      selectorsCurrent[filterIndex] * (multiplicator || 1)
                    }
                    onChange={(value) =>
                      onSelectorChange(value, resultIndex, filterIndex)
                    }
                  />
                </div>
              )
              newSelectors.push(selector)

              // Set result & current iteration
              if (selectorsCurrent[filterIndex] === undefined) {
                const newSelectorsCurrent = [...selectorsCurrent]
                newSelectorsCurrent[filterIndex] = numbers[0]
                setSelectorsCurrent(newSelectorsCurrent)
              }
              newResults.push({
                filtered: true,
                files,
                current: selectorsCurrent[filterIndex]
              })
            }
          })
        } else {
          newResults.push(...task.files)
        }
      }
    })

    setSteps(newSteps)
    setResults(newResults)
    setSelectors(newSelectors)

    setLoadingResults(false)
  }, [
    configuration?.run?.resultsFilters,
    currentSimulation?.tasks,
    selectorsCurrent
  ])

  /**
   * On selector change
   * @param {number} value Value
   * @param {number} index Index
   * @param {number} filterIndex Filter index
   */
  const onSelectorChange = (value, index, filterIndex) => {
    // Selectors
    const newSelectorsCurrent = [...selectorsCurrent]
    newSelectorsCurrent[filterIndex] = value
    setSelectorsCurrent(newSelectorsCurrent)

    // Results
    const currentResult = results[index]
    currentResult.current = value
    setResults([
      ...results.slice(0, index),
      currentResult,
      ...results.slice(index + 1)
    ])

    // Update visualization
    if (result) {
      const currentFile = currentResult.files.find(
        (file) => file.name === result.name && file.number === value
      )
      if (currentFile) setResult(currentFile)
    }
  }

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

      // API
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'run'],
          value: configuration.run
        }
      ])

      // Local
      swr.mutateOneSimulation(newSimulation)
      mutateSimulation(newSimulation)
    } catch (err) {
      ErrorNotification(errors.updateError, err)
    }
  }

  /**
   * On run
   */
  const onRun = async () => {
    setRunning(true)

    try {
      await SimulationAPI.run({ id: simulation.id })
    } catch (err) {
      ErrorNotification(errors.runError, err)
    }
  }

  /**
   * On stop
   */
  const onStop = async () => {
    try {
      await SimulationAPI.stop({ id: simulation.id })

      setRunning(false)
    } catch (err) {
      ErrorNotification(errors.stopError, err)
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
        {task?.systemLog && (
          <Button loading={logLoading} onClick={() => getLog(task.systemLog)}>
            Complete log
          </Button>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: task?.log?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />')
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: task?.warning
              ?.replace(/\n\n/g, '\n')
              .replace(/\n/g, '<br />')
          }}
          style={{ color: 'orange' }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: task?.error?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />')
          }}
          style={{ color: 'red' }}
        />
      </Tabs.TabPane>
    )
    setLogContent(<Tabs>{content}</Tabs>)

    // Open
    toggleLog()
  }

  const getLog = async (link) => {
    setLogLoading(true)

    try {
      const res = await SimulationAPI.log({ id: simulation.id }, link)
      const log = Buffer.from(res.log).toString()

      Modal.info({
        title: 'System log',
        width: 'unset',
        content: (
          <Typography.Paragraph code copyable>
            <span
              dangerouslySetInnerHTML={{
                __html: log.replace(/\n\n/g, '\n').replace(/\n/g, '<br />')
              }}
            ></span>
          </Typography.Paragraph>
        )
      })
    } catch (err) {
      ErrorNotification(errors.logError, err)
    } finally {
      setLogLoading(false)
    }
  }

  /**
   * Toogle log visibility
   */
  const toggleLog = () => {
    setLogVisible(!logVisible)
  }

  /**
   * On archive download
   */
  const onArchiveDownload = async () => {
    setDownloading([...downloading, 'archive'])

    try {
      const archive = await ResultAPI.archive({ id: simulation.id })
      const content = await archive.blob()

      const url = window.URL.createObjectURL(new Blob([content]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', simulation.scheme.name + '.zip')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      ErrorNotification(errors.downloadError, err)
    } finally {
      const index = downloading.findIndex((d) => d === 'archive')
      setDownloading([
        ...downloading.slice(0, index),
        ...downloading.slice(index + 1)
      ])
    }
  }

  /**
   * On download
   * @param {Object} file Result file
   */
  const onDownload = async (file) => {
    setDownloading([...downloading, file.glb])

    try {
      const content = await ResultAPI.download(
        { id: simulation.id },
        { originPath: file.originPath, fileName: file.fileName }
      )
      const blob = await content.blob()

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        file.name + '.' + file.fileName.split('.').pop()
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      ErrorNotification(errors.downloadError, err)
    } finally {
      const index = downloading.findIndex((d) => d === file.glb)
      setDownloading([
        ...downloading.slice(0, index),
        ...downloading.slice(index + 1)
      ])
    }
  }

  // Results render
  let resultsRender
  if (loadingResults) resultsRender = <Spin />
  else if (!results.length) resultsRender = <Card>No results yet</Card>
  else
    resultsRender = (
      <Card
        title="Results"
        extra={
          <Tooltip title="Download archive">
            <Button
              loading={downloading.find((d) => d === 'archive')}
              icon={<DownloadOutlined />}
              onClick={onArchiveDownload}
            />
          </Tooltip>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {selectors}
          {results.map((r) => {
            // Check if filtered
            let toRender = []
            if (r.filtered) {
              toRender = r.files.filter((file) => {
                return file.number === r.current
              })
            } else {
              toRender = [r]
            }
            // Render
            return toRender.map((file) => {
              return (
                <Space
                  direction=""
                  key={file.name}
                  style={{ alignItems: 'center' }}
                >
                  <Button
                    icon={
                      result?.fileName === file?.fileName &&
                      result?.name === file?.name ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )
                    }
                    onClick={() =>
                      setResult(
                        result?.fileName === file?.fileName &&
                          result?.name === file?.name
                          ? null
                          : file
                      )
                    }
                  />
                  <Button
                    loading={downloading.find((d) => d === file.glb)}
                    icon={<DownloadOutlined />}
                    size="small"
                    onClick={() => onDownload(file)}
                  />
                  {file.name}
                </Space>
              )
            })
          })}
        </Space>
      </Card>
    )

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
              <Space direction="">
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
                  type="danger"
                  icon={<StopOutlined />}
                  shape="circle"
                  onClick={onStop}
                />
              </Space>
              <Steps direction="vertical">
                {steps.map((step, index) => (
                  <Steps.Step
                    key={step}
                    title={step.label}
                    description={
                      <Button
                        icon={<FileTextOutlined />}
                        onClick={() => onLog(step, step.label)}
                        size="small"
                      />
                    }
                    subTitle={'(' + (index + 1) + '/' + steps.length + ')'}
                    status={step.status}
                  />
                ))}
              </Steps>
            </Space>
          </Card>

          {resultsRender}
        </Space>
      </Layout.Content>
    </Layout>
  )
}

Run.propTypes = {
  simulation: PropTypes.object.isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Run
