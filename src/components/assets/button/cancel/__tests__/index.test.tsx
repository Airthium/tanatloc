import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import CancelButton from '..'

describe('components/assets/button/cancel', () => {
  const mockDisabled = jest.fn(() => false)
  const mockLoading = jest.fn(() => false)
  const mockOnCancel = jest.fn()

  test('render', () => {
    const { unmount } = render(
      <CancelButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        onCancel={mockOnCancel}
      />
    )

    unmount()
  })

  test('onCancel', () => {
    const { unmount } = render(
      <CancelButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        onCancel={mockOnCancel}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)

    unmount()
  })
})
