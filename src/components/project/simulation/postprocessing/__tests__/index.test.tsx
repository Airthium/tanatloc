import Postprocessing, { errors } from '..'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontSimulationsItem, IFrontResult } from '@/api/index.d'

jest.mock('@/postprocessing', () => [
  {
    key: 'script1',
    label: 'Script 1',
    parameters: [
      {
        key: 'key1',
        label: 'Key 1'
      },
      {
        key: 'key1-1',
        label: 'Key 1-1',
        default: '1'
      }
    ]
  },
  {
    key: 'script2',
    label: 'Script 2',
    parameters: [
      {
        key: 'key2',
        label: 'Key 2'
      }
    ]
  },
  { key: 'script3', label: 'Script 3' },
  { key: 'script4', label: 'Script 4' }
])

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (text: string, err: Error) =>
    mockErrorNotification(text, err)
}))

const mockDownload = jest.fn()
jest.mock(
  '@/components/project/simulation/run/results/download',
  () => () => mockDownload()
)

const mockRun = jest.fn()
jest.mock('@/api/postprocessing', () => ({
  run: async () => mockRun()
}))

describe('components/project/simulation/postprocessing', () => {
  const simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'> = {
    id: 'id',
    scheme: {
      configuration: {
        run: {
          index: 0,
          title: 'Run',
          postprocessing: [
            { key: 'script1', parameters: [{ key: 'key1', value: 'value' }] },
            {
              key: 'script2',
              parameters: [{ key: 'key2', options: ['opt1', 'opt2'] }]
            },
            { key: 'script3' }
          ]
        }
      }
    } as IFrontSimulationsItem['scheme']
  }
  const result: Pick<IFrontResult, 'name' | 'fileName' | 'originPath'> = {
    name: 'namer',
    fileName: 'fileNamer',
    originPath: 'originPathr'
  }
  const postprocessing: Pick<IFrontResult, 'name' | 'fileName'> = {
    name: 'namep',
    fileName: 'fileNamep'
  }
  const setResult = jest.fn()

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockDownload.mockReset()
    mockDownload.mockImplementation(() => <div />)

    mockRun.mockReset()

    setResult.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Postprocessing setResult={setResult} />)

    unmount()
  })

  test('with simulation & result', () => {
    const { unmount } = render(
      <Postprocessing
        simulation={simulation}
        result={result}
        setResult={setResult}
      />
    )

    unmount()
  })

  test('without simulation postprocessing', () => {
    const { unmount } = render(
      <Postprocessing
        simulation={{
          ...simulation,
          scheme: {
            ...simulation.scheme,
            configuration: {
              ...simulation.scheme.configuration,
              run: {
                ...simulation.scheme.configuration.run,
                postprocessing: undefined
              }
            }
          }
        }}
        result={result}
        setResult={setResult}
      />
    )

    unmount()
  })

  test('no options', () => {
    const { unmount } = render(
      <Postprocessing
        simulation={{
          ...simulation,
          scheme: {
            ...simulation.scheme,
            configuration: {
              ...simulation.scheme.configuration,
              run: {
                ...simulation.scheme.configuration.run,
                postprocessing: [{ key: 'key5', parameters: [] }]
              }
            }
          }
        }}
        result={result}
        setResult={setResult}
      />
    )

    unmount()
  })

  test('visible', () => {
    const { unmount } = render(
      <Postprocessing
        simulation={simulation}
        result={result}
        setResult={setResult}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const drawer = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(drawer)

    unmount()
  })

  test('filter & run', async () => {
    const { unmount } = render(
      <Postprocessing
        simulation={simulation}
        result={result}
        postprocessing={postprocessing}
        setResult={setResult}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    const script1 = screen.getByText('Script 1')
    fireEvent.click(script1)

    const script2 = screen.getByText('Script 2')
    fireEvent.click(script2)

    const script3 = screen.getByText('Script 3')
    fireEvent.click(script3)

    // Run error
    mockRun.mockImplementation(() => {
      throw new Error('run error')
    })
    const run = screen.getByRole('button', { name: 'rocket Run' })
    fireEvent.click(run)
    waitFor(() => expect(mockRun).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.run,
        new Error('run error')
      )
    )

    // Empty
    mockRun.mockImplementation(() => [])
    fireEvent.click(run)
    waitFor(() => expect(mockRun).toHaveBeenCalledTimes(2))
    waitFor(() => screen.getByText('No results'))

    // Run
    mockRun.mockImplementation(() => [
      {
        fileName: 'fileName',
        name: 'name',
        originPath: 'originPath',
        glb: 'glb1',
        json: 'json'
      },
      {
        fileName: 'fileNamep',
        name: 'namep',
        originPath: 'originPath',
        glb: 'glb2',
        json: 'json'
      }
    ])
    fireEvent.click(run)
    waitFor(() => expect(mockRun).toHaveBeenCalledTimes(3))

    await waitFor(() => screen.getByRole('button', { name: 'eye-invisible' }))

    // on result
    const open = screen.getByRole('button', { name: 'eye-invisible' })
    fireEvent.click(open)
    expect(setResult).toHaveBeenCalledTimes(1)

    const close = screen.getByRole('button', { name: 'eye' })
    fireEvent.click(close)
    expect(setResult).toHaveBeenCalledTimes(2)

    unmount()
  })

  test('update visible', () => {
    const { rerender, unmount } = render(
      <Postprocessing
        simulation={simulation}
        result={result}
        setResult={setResult}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    rerender(<Postprocessing simulation={simulation} setResult={setResult} />)

    unmount()
  })
})
