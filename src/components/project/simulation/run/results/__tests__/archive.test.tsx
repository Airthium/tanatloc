import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ISimulation } from '@/database/simulation/index'

import Archive, { errors } from '../archive'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockResultArchive = jest.fn()
jest.mock('@/api/result', () => ({
  archive: async () => mockResultArchive()
}))

describe('components/project/simulation/run/results/archive', () => {
  const simulation = { id: 'id', scheme: { name: 'name' } }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockResultArchive.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Archive simulation={simulation as ISimulation} />
    )

    unmount()
  })

  test('onArchive', () => {
    const { unmount } = render(
      <Archive simulation={simulation as ISimulation} />
    )

    const button = screen.getByRole('button')

    // Error
    mockResultArchive.mockImplementation(() => {
      throw new Error('archive error')
    })
    fireEvent.click(button)
    waitFor(() => expect(mockResultArchive).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.archive,
        new Error('archive error')
      )
    )

    // Normal
    window.URL.createObjectURL = jest.fn()
    mockResultArchive.mockImplementation(() => ({
      blob: async () => 'archive'
    }))
    fireEvent.click(button)
    waitFor(() => expect(mockResultArchive).toHaveBeenCalledTimes(2))

    unmount()
  })
})
