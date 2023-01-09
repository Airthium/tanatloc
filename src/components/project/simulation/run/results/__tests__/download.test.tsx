import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Download, { errors } from '../download'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
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
    originPath: 'originPath'
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

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
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockResultDownload).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.download,
        new Error('download error')
      )
    )

    // Normal
    window.URL.createObjectURL = jest.fn()
    mockResultDownload.mockImplementation(() => ({
      blob: async () => 'archive'
    }))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockResultDownload).toHaveBeenCalledTimes(2))

    unmount()
  })
})
