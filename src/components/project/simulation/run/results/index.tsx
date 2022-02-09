import { useEffect, useState } from 'react'
import { Button, Card, Space, Spin, Tooltip } from 'antd'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DownloadOutlined
} from '@ant-design/icons'

import {
  onArchiveDownloadSetup,
  onDownloadSetup
} from '../runServices/downloadManager'

import {
  checkInProgressTasks,
  getUniqueNumbers,
  setMultiplicator
} from '../runServices/services'

import { setupSelector, resultManager } from '../runServices/selector'

const Results = ({ simulation, currentSimulation, result, setResult }) => {
  //State
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
  const [selectors, setSelectors]: [JSX.Element[], Function] = useState([])
  const [selectorsCurrent, setSelectorsCurrent] = useState([])

  const [downloading, setDownloading]: [string[], Function] = useState([])

  // Data
  const configuration = simulation?.scheme?.configuration

  useEffect(() => {
    const newResults = []
    const newSelectors = []

    // Results
    currentSimulation?.tasks?.forEach((task) => {
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

    setResults(newResults)
    setSelectors(newSelectors)
  }, [configuration?.run?.resultsFilter, currentSimulation?.tasks])

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
  if (!results) return <Spin />
  else if (!results.length) return <Card size="small">No results yet</Card>
  else
    return (
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
}

export default Results
