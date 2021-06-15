import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Run from '..'

const mockCloudServer = jest.fn()
jest.mock(
  '@/components/project/simulation/run/cloudServer',
  () => (props) => mockCloudServer(props)
)

const mockRun = jest.fn()
const mockStop = jest.fn()
const mockUpdate = jest.fn()
const mockSimulation = jest.fn()
const mockMutateSimulation = jest.fn()
jest.mock('@/api/simulation', () => ({
  run: async () => mockRun(),
  stop: async () => mockStop(),
  update: async () => mockUpdate(),
  useSimulation: () => [
    mockSimulation(),
    { mutateSimulation: mockMutateSimulation }
  ]
}))

const mockDownloadGet = jest.fn()
jest.mock('@/api/download', () => ({
  get: async () => mockDownloadGet()
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

describe('components/project/simulation/run', () => {
  const simulation = {
    scheme: {
      configuration: {
        about: {
          done: true
        },
        parameters: {
          done: true
        },
        run: {
          cloudServer: {},
          done: true
        }
      }
    }
  }
  const swr = { mutateOneSimulation: jest.fn() }

  beforeEach(() => {
    mockCloudServer.mockReset()
    mockCloudServer.mockImplementation(() => <div />)

    mockRun.mockReset()
    mockStop.mockReset()
    mockUpdate.mockReset()
    mockSimulation.mockReset()
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: { done: true } } },
      tasks: [
        {
          label: 'Mesh',
          index: 1,
          status: 'finish',
          file: { name: 'name', fileName: 'resultFileName' }
        },
        {
          label: 'Simulation',
          index: -1,
          files: [{ name: 'name', fileName: 'resultFileName' }],
          status: 'finish'
        },
        {
          label: 'Mesh2',
          index: 2,
          status: 'error'
        }
      ]
    }))

    mockDownloadGet.mockReset()

    mockError.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Run simulation={simulation} swr={swr} />)

    unmount()
  })

  test('not done', () => {
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: { done: true } } },
      tasks: [
        {
          status: 'finish'
        }
      ]
    }))
    const { unmount } = render(
      <Run
        simulation={{
          ...simulation,
          scheme: {
            configuration: {
              ...simulation.scheme.configuration,
              parameters: { done: false },
              run: { done: true }
            }
          }
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('running task', () => {
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: { done: true } } },
      tasks: [
        {
          status: 'running'
        }
      ]
    }))
    const { unmount } = render(<Run simulation={simulation} swr={swr} />)

    unmount()
  })

  test('no tasks', () => {
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: { done: true } } },
      tasks: undefined
    }))
    const { unmount } = render(<Run simulation={simulation} swr={swr} />)

    unmount()
  })

  test('no configuration', () => {
    mockSimulation.mockImplementation(() => ({
      scheme: {}
    }))
    const { unmount } = render(<Run simulation={{}} swr={swr} />)

    unmount()
  })

  test('resuls filter', () => {
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: { done: true } } },
      tasks: [
        {
          label: 'Mesh',
          index: 1,
          status: 'finish'
        },
        {
          label: 'Simulation',
          index: -1,
          files: [
            {
              name: 'name',
              fileName: 'Result_0.vtu'
            },
            {
              name: 'name',
              fileName: 'Result_1.vtu'
            }
          ],
          status: 'finish'
        },
        {
          label: 'Mesh2',
          index: 2,
          status: 'error'
        }
      ]
    }))
    const { unmount } = render(
      <Run
        simulation={{
          ...simulation,
          scheme: {
            configuration: {
              ...simulation.scheme.configuration,
              parameters: {
                time: {
                  children: [{}, { default: 0.01 }]
                }
              },
              run: {
                ...simulation.scheme.configuration.run,
                resultsFilters: [
                  {
                    name: 'Time',
                    prefixPattern: 'Result_',
                    suffixPattern: '.vtu',
                    pattern: 'Result_\\d+.vtu',
                    multiplicator: ['parameters', 'time', 'children', '1']
                  }
                ]
              }
            }
          }
        }}
        swr={swr}
      />
    )

    // TODO
    // const select = screen.getByRole('combobox')
    // fireEvent.change(select, { target: { value: '1' } })

    // const play = screen.getByRole('button', { name: 'play-circle' })
    // fireEvent.click(play)

    // const pause = screen.getByRole('button', { name: 'pause-circle' })
    // fireEvent.click(pause)

    unmount()
  })

  test('resuls filter without multiplicator', () => {
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: { done: true } } },
      tasks: [
        {
          label: 'Mesh',
          index: 1,
          status: 'finish'
        },
        {
          label: 'Simulation',
          index: -1,
          files: [
            {
              name: 'name',
              fileName: 'Result_0.vtu'
            },
            {
              name: 'name',
              fileName: 'Result_1.vtu'
            }
          ],
          status: 'finish'
        },
        {
          label: 'Mesh2',
          index: 2,
          status: 'error'
        }
      ]
    }))
    const { unmount } = render(
      <Run
        simulation={{
          ...simulation,
          scheme: {
            configuration: {
              ...simulation.scheme.configuration,
              parameters: {
                time: {
                  children: [{}, { default: 0.01 }]
                }
              },
              run: {
                ...simulation.scheme.configuration.run,
                resultsFilters: [
                  {
                    name: 'Time',
                    prefixPattern: 'Result_',
                    suffixPattern: '.vtu',
                    pattern: 'Result_\\d+.vtu'
                  }
                ]
              }
            }
          }
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('resuls filter without files', () => {
    mockSimulation.mockImplementation(() => ({
      scheme: { configuration: { run: { done: true } } },
      tasks: [
        {
          label: 'Mesh',
          index: 1,
          status: 'finish'
        },
        {
          label: 'Simulation',
          index: -1,
          files: [],
          status: 'finish'
        },
        {
          label: 'Mesh2',
          index: 2,
          status: 'error'
        }
      ]
    }))
    const { unmount } = render(
      <Run
        simulation={{
          ...simulation,
          scheme: {
            configuration: {
              ...simulation.scheme.configuration,
              parameters: {
                time: {
                  children: [{}, { default: 0.01 }]
                }
              },
              run: {
                ...simulation.scheme.configuration.run,
                resultsFilters: [
                  {
                    name: 'Time',
                    prefixPattern: 'Result_',
                    suffixPattern: '.vtu',
                    pattern: 'Result_\\d+.vtu'
                  }
                ]
              }
            }
          }
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('run', async () => {
    const { unmount } = render(<Run simulation={simulation} swr={swr} />)
    const run = screen.getByRole('button', { name: 'rocket Run' })
    const stop = screen.getByRole('button', { name: 'stop' })

    // Normal
    fireEvent.click(run)
    await waitFor(() => expect(mockRun).toHaveBeenCalledTimes(1))

    fireEvent.click(stop)
    await waitFor(() => expect(mockStop).toHaveBeenCalledTimes(1))

    // Error
    mockRun.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(run)
    await waitFor(() => expect(mockRun).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    mockStop.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(stop)
    await waitFor(() => expect(mockStop).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(2))

    unmount()
  })

  test('onCloudServer', async () => {
    mockCloudServer.mockImplementation((props) => (
      <div role="CloudServer" onClick={() => props.onOk({})} />
    ))
    const { unmount } = render(<Run simulation={simulation} swr={swr} />)

    const dialog = screen.getByRole('CloudServer')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(mockMutateSimulation).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onLog', () => {
    const { unmount } = render(<Run simulation={simulation} swr={swr} />)

    const logs = screen.getAllByRole('button', { name: 'file-text' })
    logs.forEach((log) => fireEvent.click(log))

    unmount()
  })

  // // test('setPart', async () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(<Run simulation={simulation} swr={swr} />)

  // //   await act(
  // //     async () =>
  // //       await wrapper
  // //         .find({ title: 'Results' })
  // //         .find('Button')
  // //         .at(1)
  // //         .props()
  // //         .onClick()
  // //   )

  // //   // Error
  // //   mockUpdate.mockImplementation(() => {
  // //     throw new Error()
  // //   })
  // //   await act(
  // //     async () =>
  // //       await wrapper
  // //         .find({ title: 'Results' })
  // //         .find('Button')
  // //         .at(1)
  // //         .props()
  // //         .onClick()
  // //   )
  // // })

  test('download', async () => {
    mockDownloadGet.mockImplementation(() => ({
      blob: jest.fn(),
      text: jest.fn()
    }))
    window.URL.createObjectURL = jest.fn()

    const { unmount } = render(<Run simulation={simulation} swr={swr} />)

    const downloads = screen.getAllByRole('button', { name: 'download' })

    // Archive
    fireEvent.click(downloads[0])
    await waitFor(() => expect(mockDownloadGet).toHaveBeenCalledTimes(1))

    // File
    fireEvent.click(downloads[1])
    await waitFor(() => expect(mockDownloadGet).toHaveBeenCalledTimes(2))

    mockDownloadGet.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(downloads[0])
    await waitFor(() => expect(mockDownloadGet).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    fireEvent.click(downloads[1])
    await waitFor(() => expect(mockDownloadGet).toHaveBeenCalledTimes(4))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(2))

    unmount()
  })
})
