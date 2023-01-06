import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontSimulationsItem, IFrontSimulationTask } from '@/api/index.d'

import Log, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockSimulationLog = jest.fn()
jest.mock('@/api/simulation', () => ({
  log: async () => mockSimulationLog()
}))

describe('components/project/simulation/run/log', () => {
  const simulation: Pick<IFrontSimulationsItem, 'id'> = {
    id: 'id'
  }
  const steps: IFrontSimulationTask[] = [
    {
      index: 0,
      label: 'label 1',
      status: 'finish',
      systemLog: 'log',
      link: {
        label: 'link',
        href: '#'
      },
      warning: 'warnings',
      error: 'errors'
    },
    {
      index: 1,
      label: 'label 2',
      status: 'finish'
    }
  ]

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockSimulationLog.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Log simulation={simulation} steps={steps} />)

    unmount()
  })

  test('onLog', () => {
    const { unmount } = render(<Log simulation={simulation} steps={steps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('Cancel', () => {
    const { unmount } = render(<Log simulation={simulation} steps={steps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const close = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(close)

    unmount()
  })

  test('getCompleteLog', async () => {
    const { unmount } = render(<Log simulation={simulation} steps={steps} />)

    // Open drawer
    const button = screen.getByRole('button')
    await act(() => fireEvent.click(button))

    // Log button
    const logButton = screen.getByText('Complete log')

    // Error
    mockSimulationLog.mockImplementationOnce(() => {
      throw new Error('log error')
    })
    await act(() => fireEvent.click(logButton))
    await waitFor(() => expect(mockSimulationLog).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.log,
        new Error('log error')
      )
    )

    // Normal
    mockSimulationLog.mockImplementationOnce(() => ({
      log: Buffer.from('log')
    }))
    await act(() => fireEvent.click(logButton))
    await waitFor(() => expect(mockSimulationLog).toHaveBeenCalledTimes(2))

    unmount()
  })
})
