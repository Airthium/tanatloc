/** @module Components.Project.Simulation.Run.Results */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Card, Select, Space, Spin } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

import Download from './download'
import Archive from './archive'

import { getFilesNumbers, getMultiplicator } from './tools'

import { ISimulation, ISimulationTaskFile } from '@/database/index.d'

export interface IProps {
  simulation: ISimulation
  currentSimulation: ISimulation
  result?: ISimulationTaskFile
  setResult: Function
}

export interface IFilteredFiles {
  filtered: true
  files: ISimulationTaskFile[]
  current: number
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
    (ISimulationTaskFile | IFilteredFiles)[],
    Dispatch<SetStateAction<(ISimulationTaskFile | IFilteredFiles)[]>>
  ] = useState()
  const [selectors, setSelectors]: [
    JSX.Element[],
    Dispatch<SetStateAction<JSX.Element[]>>
  ] = useState([])
  const [selectorsCurrent, setSelectorsCurrent] = useState([])

  // Data
  const configuration = simulation?.scheme?.configuration

  useEffect(() => {
    const newResults = []
    const newSelectors = []

    // Results
    currentSimulation?.tasks?.forEach((task) => {
      // Check file
      if (task.file) newResults.push(task.file)
      // Check files
      if (task.files) {
        // Filters
        const resultsFilters = configuration?.run?.resultsFilters
        if (resultsFilters) {
          // With filters
          resultsFilters?.forEach((filter, filterIndex) => {
            // Pattern filter
            const pattern = new RegExp(filter.pattern)
            const filteredFiles = task.files.filter((file) =>
              pattern.test(file.fileName)
            )

            // Numbering
            const filesWithNumbers = getFilesNumbers(filteredFiles, filter)
            const numbers = filesWithNumbers
              .map((file) => file.number)
              .filter((n, i, s) => s.indexOf(n) === i)
              .sort((a, b) => a - b)

            // Multiplicator
            const multiplicator = getMultiplicator(configuration, filter)

            // Set selector
            const resultIndex = newResults.length
            const selector = (
              <div key={filter.name}>
                {filter.name}:{' '}
                <Select
                  defaultValue={numbers[0]}
                  options={numbers.map((n, i) => {
                    const value = multiplicator ? n * multiplicator : i
                    const floatingPointFix = Math.round(value * 1e15) / 1e15
                    return {
                      label: floatingPointFix,
                      value: n
                    }
                  })}
                  value={selectorsCurrent[filterIndex]}
                  onChange={(value) =>
                    onSelectorChange(value, resultIndex, filterIndex)
                  }
                  className="full-width"
                />
              </div>
            )
            newSelectors.push(selector)

            // Set result & current iteration
            if (selectorsCurrent[filterIndex] === undefined)
              setSelectorsCurrent([
                ...selectorsCurrent.slice(0, selectorsCurrent[filterIndex]),
                numbers[0],
                ...selectorsCurrent.slice(selectorsCurrent[filterIndex] + 1)
              ])

            // Add files
            newResults.push({
              filtered: true,
              files: filesWithNumbers,
              current: selectorsCurrent[filterIndex]
            })
          })
        } else {
          // No filters
          newResults.push(...task.files)
        }
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
    // Selector
    const newSelectorsCurrent = [...selectorsCurrent]
    newSelectorsCurrent[filterIndex] = value

    // Results
    const newResults = [
      ...results.slice(0, index),
      {
        ...results[index],
        current: value
      },
      ...results.slice(index + 1)
    ]

    setResults(newResults)
    setSelectorsCurrent(newSelectorsCurrent)

    // Update visualization
    if (result) {
      const currentFilteredResults = results[index] as IFilteredFiles
      const currentFile = currentFilteredResults.files.find(
        (file) => file.name === result.name && file.number === value
      )
      if (currentFile) setResult(currentFile)
    }
  }

  // Results render
  if (!results) return <Spin />
  else if (!results.length) return <Card size="small">No results yet</Card>
  else
    return (
      <Card
        size="small"
        title="Results"
        extra={<Archive simulation={simulation} />}
      >
        <Space direction="vertical" className="full-width">
          {selectors}
          {results.map((r: IFilteredFiles) => {
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

Results.propTypes = {
  file: PropTypes.exact({
    originPath: PropTypes.string.isRequired,
    name: PropTypes.string,
    filename: PropTypes.string.isRequired
  }),
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired
  })
}

export default Results
