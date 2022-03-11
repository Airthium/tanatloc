import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Results from '..'

import { ISimulation, ISimulationTask } from '@/database/index.d'

const mockGetFilesNumbers = jest.fn()
const mockGetMultiplicator = jest.fn()
jest.mock('../tools', () => ({
  getFilesNumbers: () => mockGetFilesNumbers(),
  getMultiplicator: () => mockGetMultiplicator()
}))

const mockDownload = jest.fn()
jest.mock('../download', () => (props: any) => mockDownload(props))

const mockArchive = jest.fn()
jest.mock('../archive', () => (props: any) => mockArchive(props))

describe('components/project/simulation/run/results', () => {
  const currentSimulation: ISimulation = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      description: 'description',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      configuration: {}
    },
    tasks: [
      {
        label: 'label',
        status: 'finish',
        file: {
          fileName: 'file.vtu',
          name: 'file',
          type: 'result',
          originPath: 'originPath'
        },
        files: [
          {
            fileName: 'file_0.vtu',
            name: 'file',
            type: 'result',
            originPath: 'originPath'
          },
          {
            fileName: 'file_1.vtu',
            name: 'file',
            type: 'result',
            originPath: 'originPath'
          }
        ]
      }
    ]
  }
  const result = {
    fileName: 'file.vtu',
    name: 'file'
  }
  const setResult = jest.fn()

  beforeEach(() => {
    mockDownload.mockReset()
    mockDownload.mockImplementation(() => <div />)

    mockArchive.mockReset()
    mockArchive.mockImplementation(() => <div />)

    mockGetFilesNumbers.mockReset()
    mockGetMultiplicator.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Results
        simulation={currentSimulation}
        result={result}
        setResult={setResult}
      />
    )

    unmount()
  })

  test('no results', () => {
    const { unmount } = render(
      <Results
        simulation={{ id: 'id' }}
        result={result}
        setResult={setResult}
      />
    )

    screen.getByText('No results yet')

    unmount()
  })

  test('setResult', () => {
    const { unmount } = render(
      <Results
        simulation={currentSimulation}
        result={result}
        setResult={setResult}
      />
    )

    const eyeOpen = screen.getByRole('button', { name: 'eye' })
    const eyeClose = screen.getAllByRole('button', { name: 'eye-invisible' })

    fireEvent.click(eyeOpen)
    fireEvent.click(eyeClose[0])
    fireEvent.click(eyeClose[1])

    unmount()
  })

  test('with filter', async () => {
    mockGetFilesNumbers.mockImplementation(() => [
      {
        fileName: 'file_0.vtu',
        name: 'file',
        type: 'result',
        originPath: 'originPath',
        number: 0
      },
      {
        fileName: 'file_1.vtu',
        name: 'file',
        type: 'result',
        originPath: 'originPath',
        number: 1
      }
    ])
    const { unmount } = render(
      <Results
        simulation={{
          ...currentSimulation,
          scheme: {
            category: 'category',
            name: 'name',
            description: 'description',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            configuration: {
              run: {
                index: 1,
                title: 'Run',
                resultsFilter: {
                  name: 'name',
                  pattern: 'file_\\d+.vtu',
                  prefixPattern: 'file_',
                  suffixPattern: '.vtu'
                }
              }
            }
          }
        }}
        result={result}
        setResult={setResult}
      />
    )

    // Selector
    const selector = screen.getByRole('combobox')
    fireEvent.mouseDown(selector)

    const options = screen.getAllByText('1')
    fireEvent.click(options[1])
    await waitFor(() =>
      expect(setResult).toHaveBeenCalledWith({
        fileName: 'file_0.vtu',
        name: 'file',
        originPath: 'originPath',
        type: 'result'
      })
    )

    const eyeClose = screen.getByRole('button', { name: 'eye-invisible' })
    fireEvent.click(eyeClose)

    unmount()
  })

  test('with filter - result', async () => {
    mockGetFilesNumbers.mockImplementation(() => [
      {
        fileName: 'file_0.vtu',
        name: 'file',
        type: 'result',
        originPath: 'originPath',
        number: 0
      },
      {
        fileName: 'file_1.vtu',
        name: 'file',
        type: 'result',
        originPath: 'originPath',
        number: 1
      }
    ])
    const { unmount } = render(
      <Results
        simulation={{
          ...currentSimulation,
          scheme: {
            category: 'category',
            name: 'name',
            description: 'description',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            configuration: {
              run: {
                index: 1,
                title: 'Run',
                resultsFilter: {
                  name: 'name',
                  pattern: 'file_\\d+.vtu',
                  prefixPattern: 'file_',
                  suffixPattern: '.vtu'
                }
              }
            }
          }
        }}
        result={{ fileName: 'file_1.vtu', name: 'file' }}
        setResult={setResult}
      />
    )

    // Selector
    const selector = screen.getByRole('combobox')
    fireEvent.mouseDown(selector)

    const options = screen.getAllByText('1')
    fireEvent.click(options[1])
    await waitFor(() =>
      expect(setResult).toHaveBeenCalledWith({
        fileName: 'file_0.vtu',
        name: 'file',
        originPath: 'originPath',
        type: 'result'
      })
    )

    const eyeOpen = screen.getByRole('button', { name: 'eye' })
    fireEvent.click(eyeOpen)

    unmount()
  })

  test('with filter, with multiplicator', () => {
    mockGetFilesNumbers.mockImplementation(() => [
      {
        fileName: 'file_0.vtu',
        name: 'file',
        type: 'result',
        originPath: 'originPath',
        number: 0
      },
      {
        fileName: 'file_1.vtu',
        name: 'file',
        type: 'result',
        originPath: 'originPath',
        number: 1
      }
    ])
    mockGetMultiplicator.mockImplementation(() => 1)
    const { unmount } = render(
      <Results
        simulation={{
          ...currentSimulation,
          scheme: {
            category: 'category',
            name: 'name',
            description: 'description',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            configuration: {
              run: {
                index: 1,
                title: 'Run',
                resultsFilter: {
                  name: 'name',
                  pattern: 'file_\\d+.vtu',
                  prefixPattern: 'file_',
                  suffixPattern: '.vtu',
                  multiplicator: ['parameters', 'time', 'children', '1']
                }
              }
            }
          }
        }}
        setResult={setResult}
      />
    )

    unmount()
  })
})
