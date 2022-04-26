/** @module Components.Project.Simulation.Run.Results */

import { useEffect, useState } from 'react'
import { Button, Card, Select, Space, Spin } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

import { IFrontSimulation, IFrontResult } from '@/api/index.d'

import { getFilesNumbers, getMultiplicator } from './tools'
import Download from './download'
import Archive from './archive'

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
  const configuration = simulation?.scheme?.configuration

  // Get files
  useEffect(() => {
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
  useEffect(() => {
    if (!currentNumber && filteredFiles) {
      setCurrentNumber(filteredFiles?.options[0].value)
    }
  }, [filteredFiles, currentNumber])

  // Results render
  if (!singleFiles && !filteredFiles) return <Spin />
  else if (!singleFiles?.length && !filteredFiles)
    return <Card size="small">No results yet</Card>
  else
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
        <Space direction="vertical" className="full-width">
          {singleFiles?.map((file) => (
            <Space key={file.name} style={{ alignItems: 'center' }}>
              <Button
                icon={
                  result?.fileName === file?.fileName &&
                  result?.name === file?.name ? (
                    <EyeOutlined style={{ color: '#fad114' }} />
                  ) : (
                    <EyeInvisibleOutlined />
                  )
                }
                onClick={() =>
                  setResult(
                    result?.fileName === file?.fileName &&
                      result?.name === file?.name
                      ? undefined
                      : file
                  )
                }
              />
              <Download
                simulation={
                  simulation && {
                    id: simulation.id
                  }
                }
                file={
                  file && {
                    name: file.name,
                    fileName: file.fileName,
                    originPath: file.originPath
                  }
                }
              />
              {file.name}
            </Space>
          ))}
          {filteredFiles && (
            <>
              {filteredFiles.name}
              <Select
                className="full-width"
                options={filteredFiles.options}
                value={currentNumber}
                onChange={(value) => {
                  const nextResult = filteredFiles.files.find(
                    (file) =>
                      file.number === value && file.name === result?.name
                  )
                  setResult(nextResult)
                  setCurrentNumber(value)
                }}
              />
              {filteredFiles.files.map((filteredFile) => {
                if (filteredFile.number === currentNumber) {
                  return (
                    <Space
                      key={filteredFile.name}
                      style={{ alignItems: 'center' }}
                    >
                      <Button
                        icon={
                          result?.fileName === filteredFile?.fileName &&
                          result?.name === filteredFile?.name ? (
                            <EyeOutlined style={{ color: '#fad114' }} />
                          ) : (
                            <EyeInvisibleOutlined />
                          )
                        }
                        onClick={() =>
                          setResult(
                            result?.fileName === filteredFile?.fileName &&
                              result?.name === filteredFile?.name
                              ? undefined
                              : filteredFile
                          )
                        }
                      />
                      <Download
                        simulation={
                          simulation && {
                            id: simulation.id
                          }
                        }
                        file={
                          filteredFile && {
                            name: filteredFile.name,
                            fileName: filteredFile.fileName,
                            originPath: filteredFile.originPath
                          }
                        }
                      />
                      {filteredFile.name}
                    </Space>
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
