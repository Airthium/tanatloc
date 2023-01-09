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
  result?: Pick<IFrontResult, 'name' | 'fileName'>
  setResult: (result?: IFrontResult) => void
}

export interface IFilteredFiles {
  filtered: true
  name: string
  files: IFrontResult[]
  options: { label: number; value: number }[]
}

export interface ISingleResultProps {
  simulation: Pick<IFrontSimulation, 'id'>
  result?: Pick<IFrontResult, 'name' | 'fileName'>
  file: IFrontResult
  setResult: (result?: IFrontResult) => void
}

/**
 * SingleResult
 * @param props Props
 * @returns SingleResult
 */
const SingleResult = ({
  simulation,
  result,
  file,
  setResult
}: ISingleResultProps): JSX.Element => {
  /**
   * On click
   */
  const onClick = useCallback(
    () =>
      setResult(
        result?.fileName === file.fileName && result.name === file.name
          ? undefined
          : file
      ),
    [result, file, setResult]
  )

  /**
   * Render
   */
  return (
    <Space style={{ alignItems: 'center' }}>
      <Button
        icon={
          result?.fileName === file.fileName && result.name === file.name ? (
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
      {file.name}
    </Space>
  )
}

/**
 * Results
 * @param props Props
 * @returns Results
 */
const Results = ({ simulation, result, setResult }: IProps): JSX.Element => {
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
      const nextResult = filteredFiles!.files.find(
        (file) => file.number === value && file.name === result?.name
      )
      setResult(nextResult)
      setCurrentNumber(value)
    },
    [result, filteredFiles, setResult]
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
            result={result}
            file={file}
            setResult={setResult}
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
                    result={result}
                    file={filteredFile}
                    setResult={setResult}
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
