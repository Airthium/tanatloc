import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontSimulation, IFrontResult } from '@/api/index.d'

import Run, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockCloudServer = jest.fn()
jest.mock(
  '@/components/project/simulation/run/cloudServer',
  () => (props: any) => mockCloudServer(props)
)

const mockLog = jest.fn()
jest.mock(
  '@/components/project/simulation/run/log',
  () => (props: any) => mockLog(props)
)

const mockResults = jest.fn()
jest.mock(
  '@/components/project/simulation/run/results',
  () => (props: any) => mockResults(props)
)

const mockSensors = jest.fn()
jest.mock(
  '@/components/project/simulation/run/sensors',
  () => (props: any) => mockSensors(props)
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
        parameters: {
          index: 2,
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
  } as Pick<IFrontSimulation, 'id' | 'scheme'>
  const result = {
    fileName: 'fileName',
    name: 'name'
  } as IFrontResult
  const setResult = jest.fn()
  const setPostprocessing = jest.fn()
  const setVisible = jest.fn()
  const swr = { mutateOneSimulation: jest.fn() }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockCloudServer.mockReset()
    mockCloudServer.mockImplementation(() => <div />)

    mockLog.mockReset()
    mockLog.mockImplementation(() => <div />)

    mockResults.mockReset()
    mockResults.mockImplementation(() => <div />)

    mockSensors.mockReset()
    mockSensors.mockImplementation(() => <div />)

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
        setPostprocessing={setPostprocessing}
        setVisible={setVisible}
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
        setPostprocessing={setPostprocessing}
        setVisible={setVisible}
        swr={swr}
      />
    )

    const i = container.querySelector('i')
    expect(i?.className).toBe('ant-spin-dot-item')

    unmount()
  })

  test('no configuration', () => {
    const { unmount } = render(
      <Run
        simulation={
          {
            id: 'id',
            scheme: {}
          } as IFrontSimulation
        }
        result={result}
        setResult={setResult}
        setPostprocessing={setPostprocessing}
        setVisible={setVisible}
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
          } as IFrontSimulation
        }
        result={result}
        setResult={setResult}
        setPostprocessing={setPostprocessing}
        setVisible={setVisible}
        swr={swr}
      />
    )

    unmount()
  })

  test('running', async () => {
    const runningData = {
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
    }
    mockSimulation.mockImplementation(() => runningData)
    const { unmount } = render(
      <Run
        simulation={simulation}
        result={result}
        setResult={setResult}
        setPostprocessing={setPostprocessing}
        setVisible={setVisible}
        swr={swr}
      />
    )

    unmount()
  })

  test('not running', async () => {
    const notRunningData = {
      data: {
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
      }
    }
    mockSimulation.mockImplementationOnce(() => notRunningData)
    const { unmount } = render(
      <Run
        simulation={simulation}
        result={result}
        setResult={setResult}
        setPostprocessing={setPostprocessing}
        setVisible={setVisible}
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
        setPostprocessing={setPostprocessing}
        setVisible={setVisible}
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
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

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
        setPostprocessing={setPostprocessing}
        setVisible={setVisible}
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
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.run,
        new Error('run error')
      )
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    // Normal
    mockRun.mockImplementation(() => {
      // mock
    })
    fireEvent.click(run)
    await waitFor(() => expect(mockRun).toHaveBeenCalledTimes(2))

    unmount()
  })

  test('onStop', async () => {
    const { unmount } = render(
      <Run
        simulation={simulation}
        result={result}
        setResult={setResult}
        setPostprocessing={setPostprocessing}
        setVisible={setVisible}
        swr={swr}
      />
    )

    const run = screen.getByRole('button', { name: 'rocket Run' })
    const stop = screen.getByRole('button', { name: 'stop' })

    // Running
    fireEvent.click(run)

    // Error
    mockStop.mockImplementation(() => {
      throw new Error('stop error')
    })
    fireEvent.click(stop)
    await waitFor(() => expect(mockStop).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.stop,
        new Error('stop error')
      )
    )

    // Normal
    mockStop.mockImplementation(() => {
      // Empty
    })
    fireEvent.click(stop)
    await waitFor(() => expect(mockStop).toHaveBeenCalledTimes(2))

    unmount()
  })
})
