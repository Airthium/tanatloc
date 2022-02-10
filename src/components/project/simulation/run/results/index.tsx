import { useEffect, useState } from 'react'
import { Button, Card, Space, Spin } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

import Download from './download'
import Archive from './archive'

import { getUniqueNumbers, setMultiplicator } from '../runServices/services'

import { setupSelector, resultManager } from '../runServices/selector'

import { ISimulation, ISimulationTaskFile } from '@/database/index.d'

export interface IProps {
  simulation: ISimulation
  currentSimulation: ISimulation
  result: ISimulationTaskFile
  setResult: Function
}

/**
 * Results
 * @param props Props
 */
const Results = ({
  simulation,
  currentSimulation,
  result,
  setResult
}: IProps): JSX.Element => {
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
          selectorsCurrent[filterIndex] === undefined &&
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

  // Results render
  if (!results || !currentSimulation) return <Spin />
  else if (!results.length) return <Card size="small">No results yet</Card>
  else
    return (
      <Card
        size="small"
        title="Results"
        extra={<Archive simulation={simulation} />}
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
                    size="small"
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
                  <Download simulation={simulation} file={file} />
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
