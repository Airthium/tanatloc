import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Log, { errors } from '..'

import { ISimulation, ISimulationTask } from '@/database/index.d'

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
  const simulation: ISimulation = {
    id: 'id'
  }
  const steps: ISimulationTask[] = [
    {
      label: 'label 1',
      status: 'finish',
      systemLog: 'log'
    },
    {
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
    fireEvent.click(button)

    // Log button
    const logButton = screen.getByText('Complete log')

    // Error
    mockSimulationLog.mockImplementationOnce(() => {
      throw new Error('log error')
    })
    fireEvent.click(logButton)
    await waitFor(() => expect(mockSimulationLog).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.log,
        new Error('log error')
      )
    )

    // Normal
    mockSimulationLog.mockImplementationOnce(() => ({ log: 'log' }))
    fireEvent.click(logButton)
    await waitFor(() => expect(mockSimulationLog).toHaveBeenCalledTimes(2))

    unmount()
  })
})
