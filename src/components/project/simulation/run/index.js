import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Drawer,
  Layout,
  Select,
  Space,
  Steps,
  Tabs,
  Tooltip
} from 'antd'
import {
  DownloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  RocketOutlined,
  StopOutlined
} from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'

import CloudServer from './cloudServer'

import SimulationAPI from '@/api/simulation'
import DownloadAPI from '@/api/download'

/**
 * Errors simulation/run
 * @memberof module:components/project/simulation
 */
const errors = {
  runError: 'Unable to run the simulation',
  stopError: 'Unable to stop the simulation',
  updateError: 'Unable to update the simulation',
  downloadError: 'Unable to download the file'
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

  const [selectors, setSelectors] = useState([])
  const [selectorsCurrent, setSelectorsCurrent] = useState([])

  const [results, setResults] = useState([])
  const [steps, setSteps] = useState([]) //TODO

  const [downloading, setDownloading] = useState([])
  const [play, setPlay] = useState()

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
  }, [JSON.stringify(configuration)])

  // Running
  useEffect(() => {
    if (!currentSimulation) {
      setRunning(false)
      return
    }
    if (!currentSimulation.tasks) {
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
  }, [JSON.stringify(currentSimulation?.tasks)])

  // Steps & Results
  useEffect(() => {
    if (!currentSimulation) return
    if (!currentSimulation.tasks) return

    const newSteps = []
    const newResults = []
    const newSelectors = []
    currentSimulation.tasks.forEach((task, index) => {
      // Steps
      newSteps[task.index || index] = {
        label: task.label,
        status: task.status,
        log: task.log,
        warning: task.warning,
        error: task.warning
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
                .filter((value, index, self) => self.indexOf(value) === index)

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
                    options={numbers.map((n, index) => ({
                      label: multiplicator ? n * multiplicator : index,
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
                  <Button
                    disabled={play}
                    icon={<PlayCircleOutlined />}
                    size="small"
                    onClick={() => onPlay(resultIndex, filterIndex)}
                  />
                  <Button
                    disabled={!play}
                    icon={<PauseCircleOutlined />}
                    size="small"
                    onClick={() => onPause()}
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
  }, [
    JSON.stringify(configuration?.run?.resultsFilters),
    JSON.stringify(currentSimulation?.tasks),
    JSON.stringify(selectorsCurrent)
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
    const newResult = results[index]
    newResult.current = value
    setResults([
      ...results.slice(0, index),
      newResult,
      ...results.slice(index + 1)
    ])

    // TODO
    // Update visualization
    // const currentPart = currentConfiguration.part
    // if (currentPart?.number !== undefined) {
    //   const newPart = newResult.files.find(
    //     (file) => file.name === currentPart.name && file.number === value
    //   )
    //   if (newPart) setPart(newPart)
    // }
  }

  /**
   * On play
   * @param {number} index Index
   * @param {number} filterIndex Filter index
   */
  const onPlay = (index, filterIndex) => {
    const player = setInterval(() => {
      const value = selectorsCurrent[filterIndex] + 1

      // Selectors
      setSelectorsCurrent((prev) => {
        prev[filterIndex] = prev[filterIndex] + 1
        return prev
      })

      // Results
      const newResult = results[index]
      newResult.current = value
      setResults([
        ...results.slice(0, index),
        newResult,
        ...results.slice(index + 1)
      ])

      // TODO
      // // Update visualization
      // const currentPart = currentConfiguration.part
      // if (currentPart?.number !== undefined) {
      //   const newPart = newResult.files.find(
      //     (file) => file.name === currentPart.name && file.number === value
      //   )
      //   if (newPart) setPart(newPart)
      // }
    }, 2000)

    setPlay(player)
  }

  /**
   * On pause
   * @param {number} index Index
   * @param {number} filterIndex Filter index
   */
  const onPause = () => {
    if (play) {
      clearInterval(play)
      setPlay()
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

  /**
   * Toogle log visibility
   */
  const toggleLog = () => {
    setLogVisible(!logVisible)
  }

  // /**
  //  * Set part
  //  * @param {Object} file File
  //  */
  // const setPart = async (file) => {
  //   // Update local
  //   currentConfiguration.part = file

  //   try {
  //     // Update simulation
  //     if (file) {
  //       await SimulationAPI.update({ id: simulation.id }, [
  //         {
  //           key: 'scheme',
  //           type: 'json',
  //           method: 'set',
  //           path: ['configuration', 'part'],
  //           value: file
  //         }
  //       ])
  //     } else {
  //       await SimulationAPI.update({ id: simulation.id }, [
  //         {
  //           key: 'scheme',
  //           type: 'json',
  //           method: 'erase',
  //           path: ['configuration', 'part']
  //         }
  //       ])
  //     }

  //     // Mutate
  //     swr.mutateOneSimulation(currentSimulation)
  //   } catch (err) {
  //     ErrorNotification(errors.updateError, err)
  //   }
  // }

  /**
   * On archive download
   */
  const onArchiveDownload = async () => {
    setDownloading([...downloading, 'archive'])

    try {
      const archive = await DownloadAPI.get({ id: simulation.id }, null, true)
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
   * @param {Object} result Result
   */
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
      ErrorNotification(errors.downloadError, err)
    } finally {
      const index = downloading.findIndex((d) => d === result)
      setDownloading([
        ...downloading.slice(0, index),
        ...downloading.slice(index + 1)
      ])
    }
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

          {results.length ? (
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
                  return toRender.map((result) => {
                    return (
                      <Space
                        direction=""
                        key={result.name}
                        style={{ alignItems: 'center' }}
                      >
                        <Button
                          icon={
                            <EyeOutlined />
                            // currentConfiguration?.part?.fileName ===
                            //   result?.fileName &&
                            // currentConfiguration?.part?.name ===
                            //   result?.name ? (
                            //   <EyeInvisibleOutlined />
                            // ) : (
                            //   <EyeOutlined />
                            // )
                          }
                          onClick={
                            () => {}
                            // setPart(
                            //   currentConfiguration?.part?.fileName ===
                            //     result?.fileName &&
                            //     currentConfiguration?.part?.name ===
                            //       result?.name
                            //     ? null
                            //     : result
                            // )
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
                  })
                })}
              </Space>
            </Card>
          ) : null}
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
