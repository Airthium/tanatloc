import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Run from '..'

import { ISimulation, ISimulationTaskFile } from '@/database/index.d'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockCloudServer = jest.fn()
jest.mock(
  '@/components/project/simulation/run/cloudServer',
  () => (props: {}) => mockCloudServer(props)
)

const mockLog = jest.fn()
jest.mock(
  '@/components/project/simulation/run/log',
  () => (props: {}) => mockLog(props)
)

const mockResults = jest.fn()
jest.mock(
  '@/components/project/simulation/run/results',
  () => (props: {}) => mockResults(props)
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

describe('components/project/simulation/run', () => {
  const simulation = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      description: 'description',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      configuration: {
        about: {
          done: true
        },
        parameters: {
          index: 1,
          title: 'Parameters',
          done: true
        },
        run: {
          index: 2,
          title: 'Run',
          cloudServer: {},
          done: true
        }
      }
    }
  }
  const result = {
    fileName: 'fileName',
    name: 'name',
    number: 1,
    type: 'type',
    originPath: 'originPath'
  } as ISimulationTaskFile
  const setResult = jest.fn()
  const swr = { mutateOneSimulation: jest.fn() }

  beforeEach(() => {
    mockError.mockReset()

    mockCloudServer.mockReset()
    mockCloudServer.mockImplementation(() => <div />)

    mockLog.mockReset()
    mockLog.mockImplementation(() => <div />)

    mockResults.mockReset()
    mockResults.mockImplementation(() => <div />)

    mockRun.mockReset()
    mockStop.mockReset()
    mockUpdate.mockReset()
    mockSimulation.mockReset()
    const data = {
      scheme: { configuration: { run: { done: true } } },
      tasks: [
        null,
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
          status: 'finish',
          systemLog: 'system'
        },
        {
          label: 'Mesh2',
          index: 2,
          status: 'error',
          systemLog: 'system'
        }
      ]
    }
    mockSimulation.mockImplementation(() => data)
  })

  test('render', () => {
    const { unmount } = render(
      <Run
        simulation={simulation}
        result={result}
        setResult={setResult}
        swr={swr}
      />
    )

    unmount()
  })

  test('loading', () => {
    mockSimulation.mockImplementation(() => null)
    const { container, unmount } = render(
      <Run
        simulation={simulation}
        result={result}
        setResult={setResult}
        swr={swr}
      />
    )

    const i = container.querySelector('i')
    expect(i.className).toBe('ant-spin-dot-item')

    unmount()
  })

  test('without configuration', () => {
    const { unmount } = render(
      <Run
        simulation={{ id: 'id' }}
        result={result}
        setResult={setResult}
        swr={swr}
      />
    )

    unmount()
  })

  test('not done', () => {
    const { unmount } = render(
      <Run
        simulation={
          {
            id: 'id',
            scheme: {
              configuration: {
                parameters: {
                  done: false
                },
                run: {}
              }
            }
          } as ISimulation
        }
        result={result}
        setResult={setResult}
        swr={swr}
      />
    )

    unmount()
  })

  test('running', async () => {
    mockSimulation.mockImplementationOnce(() => ({
      scheme: { configuration: { run: { cloudServer: {} } } },
      tasks: [
        null,
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
          status: 'finish',
          systemLog: 'system'
        },
        {
          label: 'Mesh2',
          index: 2,
          status: 'process',
          systemLog: 'system'
        }
      ]
    }))
    const { unmount } = render(
      <Run
        simulation={simulation}
        result={result}
        setResult={setResult}
        swr={swr}
      />
    )

    unmount()
  })

  test('not running', async () => {
    mockSimulation.mockImplementationOnce(() => ({
      scheme: { configuration: { run: {} } },
      tasks: [
        null,
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
          status: 'finish',
          systemLog: 'system'
        },
        {
          label: 'Mesh2',
          index: 2,
          status: 'finish',
          systemLog: 'system'
        }
      ]
    }))
    const { unmount } = render(
      <Run
        simulation={simulation}
        result={result}
        setResult={setResult}
        swr={swr}
      />
    )

    unmount()
  })

  test('onCloudServer', async () => {
    mockCloudServer.mockImplementation((props) => (
      <div role="CloudServer" onClick={() => props.onOk({})} />
    ))
    const { unmount } = render(
      <Run
        simulation={simulation}
        result={result}
        setResult={setResult}
        swr={swr}
      />
    )

    const cloudServer = screen.getByRole('CloudServer')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(cloudServer)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    mockUpdate.mockImplementation(() => {
      // mock
    })
    fireEvent.click(cloudServer)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(mockMutateSimulation).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onRun', async () => {
    const { unmount } = render(
      <Run
        simulation={simulation}
        result={result}
        setResult={setResult}
        swr={swr}
      />
    )

    const run = screen.getByRole('button', { name: 'rocket Run' })

    // Error
    mockRun.mockImplementation(() => {
      throw new Error('run error')
    })
    fireEvent.click(run)
    await waitFor(() => expect(mockRun).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    mockRun.mockImplementation(() => {
      // mock
    })
    fireEvent.click(run)
    await waitFor(() => expect(mockRun).toHaveBeenCalledTimes(2))

    unmount()
  })

  // test('onStop', async () => {
  //   const { unmount } = render(
  //     <Run
  //       simulation={simulation}
  //       result={result}
  //       setResult={setResult}
  //       swr={swr}
  //     />
  //   )

  // TODO Should run to use stop

  //   const stop = screen.getByRole('button', { name: 'stop' })

  //   // Error
  //   mockStop.mockImplementation(() => {
  //     throw new Error('stop error')
  //   })
  //   fireEvent.click(stop)
  //   await waitFor(() => expect(mockStop).toHaveBeenCalledTimes(1))
  //   await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

  //   // Normal
  //   mockStop.mockImplementation(() => {
  //     // Empty
  //   })
  //   fireEvent.click(stop)
  //   await waitFor(() => expect(mockStop).toHaveBeenCalledTimes(2))

  //   unmount()
  // })
})
