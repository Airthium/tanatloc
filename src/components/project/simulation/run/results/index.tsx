/** @module Components.Project.Simulation.Run.Results */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Card, Select, Space, Spin } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

import { ISimulation, ISimulationTaskFile } from '@/database/index.d'

import { getFilesNumbers, getMultiplicator } from './tools'

import Download from './download'
import Archive from './archive'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  result?: Omit<Omit<ISimulationTaskFile, 'originPath'>, 'type'>
  setResult: Dispatch<SetStateAction<ISimulationTaskFile>>
}

export interface IFilteredFiles {
  filtered: true
  name: string
  files: ISimulationTaskFile[]
  options: { label: string; value: number }[]
}

/**
 * Results
 * @param props Props
 * @returns Results
 */
const Results = ({ simulation, result, setResult }: IProps): JSX.Element => {
  //State
  const [files, setFiles]: [
    (ISimulationTaskFile | IFilteredFiles)[],
    Dispatch<SetStateAction<(ISimulationTaskFile | IFilteredFiles)[]>>
  ] = useState()
  const [currentNumber, setCurrentNumber]: [
    number,
    Dispatch<SetStateAction<number>>
  ] = useState()

  // Data
  const configuration = simulation?.scheme?.configuration

  // Get files
  useEffect(() => {
    if (!simulation?.tasks) {
      setFiles([])
      return
    }

    // New files
    const newFiles = []

    // Filter
    const filter = configuration?.run?.resultsFilter

    // Loop tasks
    simulation.tasks.forEach((task) => {
      // Check file
      if (task.file) newFiles.push(task.file)

      // Check files
      if (task.files) {
        if (!filter) {
          newFiles.push(...task.files)
        } else {
          // Pattern filter
          const pattern = new RegExp(filter.pattern)
          const notFilteredFiles = task.files.filter(
            (file) => !pattern.test(file.fileName)
          )
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

          // Options
          const options = numbers.map((n, i) => {
            const value = multiplicator ? n * multiplicator : i
            const floatingPointFix = Math.round(value * 1e15) / 1e15
            return {
              label: floatingPointFix,
              value: n
            }
          })

          // Add to results
          newFiles.push(...notFilteredFiles)
          newFiles.push({
            filtered: true,
            name: filter.name,
            files: filesWithNumbers,
            options
          })
        }
      }
    })

    setFiles(newFiles)
  }, [simulation, configuration])

  // Initial number
  useEffect(() => {
    if (!currentNumber && files) {
      const filtered = files.find((file) => (file as IFilteredFiles).filtered)
      setCurrentNumber((filtered as IFilteredFiles)?.options[0].value)
    }
  }, [files, currentNumber])

  // Results render
  if (!files) return <Spin />
  else if (!files.length) return <Card size="small">No results yet</Card>
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
          {files.map((file) => {
            if ((file as IFilteredFiles).filtered) {
              const filtered = file as IFilteredFiles

              return (
                <>
                  {filtered.name}
                  <Select
                    className="full-width"
                    options={filtered.options}
                    value={currentNumber}
                    onChange={(value) => setCurrentNumber(value)}
                  />
                  {filtered.files.map((filteredFile) => {
                    if (filteredFile.number === currentNumber) {
                      return (
                        <Space
                          key={filteredFile.fileName}
                          style={{ alignItems: 'center' }}
                        >
                          <Button
                            size="small"
                            icon={
                              result?.fileName === filteredFile?.fileName &&
                              result?.name === filteredFile?.name ? (
                                <EyeOutlined />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                            onClick={() =>
                              setResult(
                                result?.fileName === filteredFile?.fileName &&
                                  result?.name === filteredFile?.name
                                  ? null
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
                                name: filtered.name,
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
              )
            } else {
              const singleFile = file as ISimulationTaskFile
              return (
                <Space key={singleFile.name} style={{ alignItems: 'center' }}>
                  <Button
                    size="small"
                    icon={
                      result?.fileName === singleFile?.fileName &&
                      result?.name === singleFile?.name ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )
                    }
                    onClick={() =>
                      setResult(
                        result?.fileName === singleFile?.fileName &&
                          result?.name === singleFile?.name
                          ? null
                          : singleFile
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
                      singleFile && {
                        name: singleFile.name,
                        fileName: singleFile.fileName,
                        originPath: singleFile.originPath
                      }
                    }
                  />
                  {singleFile.name}
                </Space>
              )
            }
          })}
        </Space>
      </Card>
    )
}

Results.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.object,
    tasks: PropTypes.array
  }),
  result: PropTypes.exact({
    name: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired
  }),
  setResult: PropTypes.func.isRequired
}

export default Results
