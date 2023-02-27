/** @module Components.Project.Simulation.Run.Results */

import { useCallback, useMemo, useState } from 'react'
import { Button, Card, Select, Space, Spin } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

import { IFrontSimulation, IFrontResult } from '@/api/index.d'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { getFilesNumbers, getMultiplicator } from './tools'
import Download from './download'
import Archive from './archive'

import { globalStyle } from '@/styles'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulation, 'id' | 'scheme' | 'tasks'>
  results: IFrontResult[]
  setResults: (results: IFrontResult[]) => void
}

export interface IFilteredFiles {
  filtered: true
  name: string
  files: IFrontResult[]
  options: { label: number; value: number }[]
}

export interface ISingleResultProps {
  simulation: Pick<IFrontSimulation, 'id'>
  results: IFrontResult[]
  file: IFrontResult
  setResults: (results: IFrontResult[]) => void
}

/**
 * SingleResult
 * @param props Props
 * @returns SingleResult
 */
const SingleResult = ({
  simulation,
  results,
  file,
  setResults
}: ISingleResultProps): JSX.Element => {
  /**
   * On click
   */
  const onClick = useCallback(() => {
    const index = results.findIndex(
      (result) => result.fileName === file.fileName && result.name === file.name
    )
    if (index === -1) setResults([...results, file])
    else setResults([...results.slice(0, index), ...results.slice(index + 1)])
  }, [results, file, setResults])

  const visible = useMemo(() => {
    return results.find(
      (result) => result.fileName === file.fileName && result.name === file.name
    )
  }, [results, file])

  /**
   * Render
   */
  return (
    <Space style={{ alignItems: 'center' }}>
      <Button
        icon={
          visible ? (
            <EyeOutlined style={{ color: '#fad114' }} />
          ) : (
            <EyeInvisibleOutlined />
          )
        }
        onClick={onClick}
      />
      <Download
        simulation={{
          id: simulation.id
        }}
        file={{
          name: file.name,
          fileName: file.fileName,
          originPath: file.originPath
        }}
      />
      {file.name?.replaceAll('_', ' ')}
    </Space>
  )
}

/**
 * Results
 * @param props Props
 * @returns Results
 */
const Results = ({ simulation, results, setResults }: IProps): JSX.Element => {
  //State
  const [singleFiles, setSingleFiles] = useState<IFrontResult[]>()
  const [filteredFiles, setFilteredFiles] = useState<IFilteredFiles>()
  const [currentNumber, setCurrentNumber] = useState<number>()

  // Data
  const configuration = useMemo(
    () => simulation?.scheme?.configuration,
    [simulation]
  )

  // Get files
  useCustomEffect(() => {
    if (!simulation?.tasks) {
      setSingleFiles([])
      setFilteredFiles(undefined)
      return
    }

    // New files
    const newSingleFiles: IFrontResult[] = []

    // Filter
    const filter = configuration?.run?.resultsFilter

    // Loop tasks
    simulation.tasks.forEach((task) => {
      // Check file
      if (task.file) newSingleFiles.push(task.file)

      // Check files
      if (task.files) {
        if (!filter) {
          newSingleFiles.push(...task.files)
        } else {
          // Pattern filter
          const pattern = new RegExp(filter.pattern)
          const notFilteredFiles = task.files.filter(
            (file: IFrontResult) => !pattern.test(file.fileName)
          )
          const files = task.files.filter((file: IFrontResult) =>
            pattern.test(file.fileName)
          )

          // Numbering
          const filesWithNumbers = getFilesNumbers(files, filter)
          const numbers = filesWithNumbers
            .map((file) => file.number)
            .filter((n, i, s) => s.indexOf(n) === i)
            .sort((a, b) => a - b)

          // Multiplicator
          const multiplicator = getMultiplicator(configuration, filter)

          // Options
          const options = numbers.map((n, i) => {
            const value = multiplicator ? n * multiplicator : i
            const floatingPointFix = Math.round(value * 1e15) / 1e15
            return {
              label: floatingPointFix,
              value: n
            }
          })

          // Add to single files
          newSingleFiles.push(...notFilteredFiles)

          // Add to filtered
          setFilteredFiles({
            filtered: true,
            name: filter.name,
            files: filesWithNumbers,
            options
          })
        }
      }
    })

    setSingleFiles(newSingleFiles)
  }, [simulation, configuration])

  // Initial number
  useCustomEffect(() => {
    if (!currentNumber && filteredFiles) {
      setCurrentNumber(filteredFiles?.options[0].value)
    }
  }, [filteredFiles, currentNumber])

  /**
   * On change
   * @param value Value
   */
  const onChange = useCallback(
    (value: number): void => {
      const nextResults = filteredFiles!.files.filter(
        (file) =>
          file.number === value &&
          results.find((result) => result.name === file.name)
      )
      setResults(nextResults)
      setCurrentNumber(value)
    },
    [results, filteredFiles, setResults]
  )

  // Results render
  if (!singleFiles && !filteredFiles) return <Spin />
  if (!singleFiles?.length && !filteredFiles)
    return <Card size="small">No results yet</Card>
  return (
    <Card
      size="small"
      title="Results"
      extra={
        <Archive
          simulation={
            simulation && {
              id: simulation.id,
              scheme: simulation.scheme
            }
          }
        />
      }
    >
      <Space direction="vertical" css={globalStyle.fullWidth}>
        {singleFiles?.map((file) => (
          <SingleResult
            key={file.name}
            simulation={simulation}
            results={results}
            file={file}
            setResults={setResults}
          />
        ))}
        {filteredFiles && (
          <>
            {filteredFiles.name}
            <Select
              css={globalStyle.fullWidth}
              options={filteredFiles.options}
              value={currentNumber}
              onChange={onChange}
            />
            {filteredFiles.files.map((filteredFile) => {
              if (filteredFile.number === currentNumber) {
                return (
                  <SingleResult
                    key={filteredFile.name}
                    simulation={simulation}
                    results={results}
                    file={filteredFile}
                    setResults={setResults}
                  />
                )
              }
            })}
          </>
        )}
      </Space>
    </Card>
  )
}

export default Results
