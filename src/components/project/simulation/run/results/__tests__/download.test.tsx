import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Download from '../download'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockResultDownload = jest.fn()
jest.mock('@/api/result', () => ({
  download: async () => mockResultDownload()
}))

describe('components/project/simulation/run/results/archive', () => {
  const simulation = { id: 'id' }
  const file = {
    name: 'name',
    fileName: 'fileName',
    originPath: 'originPath',
    type: 'result'
  }

  beforeEach(() => {
    mockError.mockReset()

    mockResultDownload.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Download simulation={simulation} file={file} />)

    unmount()
  })

  test('onArchive', async () => {
    const { unmount } = render(<Download simulation={simulation} file={file} />)

    const button = screen.getByRole('button')

    // Error
    mockResultDownload.mockImplementation(() => {
      throw new Error('download error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockResultDownload).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    window.URL.createObjectURL = jest.fn()
    mockResultDownload.mockImplementation(() => ({
      blob: async () => 'archive'
    }))
    fireEvent.click(button)
    await waitFor(() => expect(mockResultDownload).toHaveBeenCalledTimes(2))

    unmount()
  })
})
