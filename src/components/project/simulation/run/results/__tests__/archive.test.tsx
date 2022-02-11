import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ISimulation } from '@/database/index.d'

import Archive from '../archive'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockResultArchive = jest.fn()
jest.mock('@/api/result', () => ({
  archive: async () => mockResultArchive()
}))

describe('components/project/simulation/run/results/archive', () => {
  const simulation = { id: 'id', scheme: { name: 'name' } }

  beforeEach(() => {
    mockError.mockReset()

    mockResultArchive.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Archive simulation={simulation as ISimulation} />
    )

    unmount()
  })

  test('onArchive', async () => {
    const { unmount } = render(
      <Archive simulation={simulation as ISimulation} />
    )

    const button = screen.getByRole('button')

    // Error
    mockResultArchive.mockImplementation(() => {
      throw new Error('archive error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockResultArchive).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    window.URL.createObjectURL = jest.fn()
    mockResultArchive.mockImplementation(() => ({
      blob: async () => 'archive'
    }))
    fireEvent.click(button)
    await waitFor(() => expect(mockResultArchive).toHaveBeenCalledTimes(2))

    unmount()
  })
})
