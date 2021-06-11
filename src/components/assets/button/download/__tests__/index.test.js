import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import DownloadButton from '@/components/assets/button/download'

describe('components/assets/button/download', () => {
  const mockDisabled = jest.fn(() => false)
  const mockLoading = jest.fn(() => false)
  const mockOnDownload = jest.fn()

  test('render', () => {
    const { unmount } = render(
      <DownloadButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        onDownload={mockOnDownload}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnDownload).toHaveBeenCalledTimes(1)

    unmount()
  })
})
