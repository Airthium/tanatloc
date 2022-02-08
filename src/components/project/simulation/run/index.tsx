import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Drawer,
  Layout,
  Space,
  Spin,
  Steps,
  Tabs,
  Tooltip
} from 'antd'
import {
  DownloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  RocketOutlined,
  StopOutlined
} from '@ant-design/icons'

import { ISimulation, ISimulationTask } from '@/database/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'

import CloudServer from './cloudServer'

import SimulationAPI from '@/api/simulation'

import {
  checkInProgressTasks,
  getUniqueNumbers,
  setMultiplicator
} from './runServices/services'
import { setupSelector, resultManager } from './runServices/selector'
import { onLogSetup } from './runServices/logManager'
import {
  onArchiveDownloadSetup,
  onDownloadSetup
} from './runServices/downloadManager'

export interface IProps {
  simulation: ISimulation
  result: {
    fileName: string
    name: string
    number: number
  }
  setResult: Function
  swr: {
    mutateOneSimulation: Function
  }
}

/**
 * Errors (run)
 * @memberof Components.Project.Simulation
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
 * @memberof Components.Project.Simulation
 * @param {Object} props Props `{ simulation, result, setResult, swr }`
 */
const Run = ({ simulation, result, setResult, swr }: IProps): JSX.Element => {
  // State
  const [disabled, setDisabled]: [boolean, Function] = useState(false)
  const [running, setRunning]: [boolean, Function] = useState(false)

  const [logVisible, setLogVisible]: [boolean, Function] = useState(false)
  const [logContent, setLogContent]: [string, Function] = useState()
  const [logLoading, setLogLoading]: [boolean, Function] = useState(false)

  const [selectors, setSelectors]: [JSX.Element[], Function] = useState([])
  const [selectorsCurrent, setSelectorsCurrent] = useState([])

  const [results, setResults]: [
    {
      name: string
      number: number
      filtered?: boolean
      files?: { name: string; number: number }[]
      current?: number
    }[],
    Function
  ] = useState()
  const [steps, setSteps]: [ISimulationTask[], Function] = useState([])

  const [downloading, setDownloading]: [string[], Function] = useState([])

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
    checkInProgressTasks(currentSimulation, setRunning)
  }, [currentSimulation?.tasks])

  // Steps & Results
  useEffect(() => {
    const newSteps = []
    const newResults = []
    const newSelectors = []

    !currentSimulation?.tasks && setResults([])

    currentSimulation?.tasks?.forEach((task) => {
      if (!task) return
      // Steps
      newSteps[task.index] = {
        label: task.label,
        status: task.status,
        log: task.log,
        pluginLog: task.pluginLog,
        warning: task.warning,
        error: task.error,
        systemLog: task.systemLog
      }

      // Results
      if (task.file) newResults.push(task.file)
      if (task.files) {
        // Filters
        const resultsFilters = configuration?.run?.resultsFilters
        !resultsFilters && newResults.push(...task.files)
        //Sort by filters
        resultsFilters?.forEach((filter, filterIndex) => {
          const pattern = new RegExp(filter.pattern)
          const filteredFiles = task.files.filter((file) =>
            pattern.test(file.fileName)
          )

          let fileData = getUniqueNumbers(filteredFiles, filter)
          let files = fileData?.files
          let numbers = fileData?.numbers
          let multiplicator = setMultiplicator(filter, configuration)

          // Set selector
          const resultIndex = newResults.length
          const selector = setupSelector(
            filter,
            numbers,
            multiplicator,
            filterIndex,
            resultIndex,
            onSelectorChange,
            selectorsCurrent
          )

          newSelectors.push(selector)
          // Set result & current iteration
          !selectorsCurrent[filterIndex] &&
            setSelectorsCurrent([
              ...selectorsCurrent.slice(0, selectorsCurrent[filterIndex]),
              numbers[0],
              ...selectorsCurrent.slice(selectorsCurrent[filterIndex] + 1)
            ])
          newResults.push({
            filtered: true,
            files,
            current: selectorsCurrent[filterIndex]
          })
        })
      }
    })

    setSteps(newSteps)
    setResults(newResults)
    setSelectors(newSelectors)
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
  const onSelectorChange = (
    value: number,
    index: number,
    filterIndex: number
  ) => {
    const resultData = resultManager(
      value,
      index,
      filterIndex,
      results,
      result,
      selectorsCurrent
    )
    setResults(resultData?.results)
    setResult(resultData?.result)
    setSelectorsCurrent(resultData?.selectorsCurrent)
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
  const onLog = (task: object, title: string) => {
    // Content
    const content = onLogSetup(
      task,
      title,
      logLoading,
      simulation,
      setLogLoading
    )
    content && setLogContent(<Tabs>{content}</Tabs>)

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
   * On archive download
   */
  const onArchiveDownload = async () => {
    await onArchiveDownloadSetup(downloading, setDownloading, simulation)
  }

  /**
   * On download
   * @param {Object} file Result file
   */
  const onDownload = async (file) => {
    await onDownloadSetup(file, downloading, setDownloading, simulation)
  }

  // Results render
  let resultsRender
  if (!results) resultsRender = <Spin />
  else if (!results.length)
    resultsRender = <Card size="small">No results yet</Card>
  else
    resultsRender = (
      <Card
        size="small"
        title="Results"
        extra={
          <Tooltip title="Download archive">
            <Button
              loading={!!downloading.find((d) => d === 'archive')}
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
                <Space key={file.name} style={{ alignItems: 'center' }}>
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
                    loading={!!downloading.find((d) => d === file.glb)}
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
          <Card size="small" title="Run">
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
                  danger
                  icon={<StopOutlined />}
                  shape="circle"
                  onClick={onStop}
                />
              </Space>
              <Steps direction="vertical">
                {steps.map((step, index) => (
                  <Steps.Step
                    key={JSON.stringify(step)}
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
