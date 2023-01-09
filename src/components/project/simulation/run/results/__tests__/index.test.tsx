import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontSimulation } from '@/api/index.d'

import Results from '..'

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
  const simulation = {
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
          name: 'file1',
          type: 'result',
          originPath: 'originPath'
        },
        files: [
          {
            fileName: 'file_0.vtu',
            name: 'file2',
            type: 'result',
            originPath: 'originPath'
          },
          {
            fileName: 'file_1.vtu',
            name: 'file3',
            type: 'result',
            originPath: 'originPath'
          }
        ]
      }
    ]
  } as IFrontSimulation
  const result = {
    fileName: 'file.vtu',
    name: 'file1'
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
      <Results simulation={simulation} result={result} setResult={setResult} />
    )

    unmount()
  })

  test('render - empty tasks', () => {
    const { unmount } = render(
      <Results
        simulation={{
          ...simulation,
          tasks: [{ label: 'label', status: 'finish', file: null, files: null }]
        }}
        result={result}
        setResult={setResult}
      />
    )

    unmount()
  })

  test('no results', () => {
    const { unmount } = render(
      <Results
        simulation={{ id: 'id' } as IFrontSimulation}
        result={result}
        setResult={setResult}
      />
    )

    screen.getByText('No results yet')

    unmount()
  })

  test('setResult', () => {
    const { unmount } = render(
      <Results simulation={simulation} result={result} setResult={setResult} />
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
        simulation={
          {
            ...simulation,
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
          } as IFrontSimulation
        }
        result={result}
        setResult={setResult}
      />
    )

    // Selector
    const selector = screen.getByRole('combobox')
    await act(() => fireEvent.mouseDown(selector))

    const options = screen.getAllByText('1')
    await act(() => fireEvent.click(options[1]))

    const eyeClose = screen.getByRole('button', { name: 'eye-invisible' })
    await act(() => fireEvent.click(eyeClose))

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
        simulation={
          {
            ...simulation,
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
          } as IFrontSimulation
        }
        result={{ fileName: 'file_1.vtu', name: 'file' }}
        setResult={setResult}
      />
    )

    // Selector
    const selector = screen.getByRole('combobox')
    await act(() => fireEvent.mouseDown(selector))

    const options = screen.getAllByText('1')
    await act(() => fireEvent.click(options[1]))
    await waitFor(() =>
      expect(setResult).toHaveBeenLastCalledWith({
        fileName: 'file_1.vtu',
        name: 'file',
        number: 1,
        originPath: 'originPath',
        type: 'result'
      })
    )

    const eyeOpen = screen.getByRole('button', { name: 'eye' })
    await act(() => fireEvent.click(eyeOpen))

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
        simulation={
          {
            ...simulation,
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
          } as IFrontSimulation
        }
        setResult={setResult}
      />
    )

    unmount()
  })
})
