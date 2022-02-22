import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import AddButton from '@/components/assets/button/add'

describe('components/assets/button/add', () => {
  const mockDisabled = jest.fn(() => false)
  const mockLoading = jest.fn(() => false)
  const mockOnAdd = jest.fn()

  test('render', () => {
    const { unmount } = render(
      <AddButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        onAdd={mockOnAdd}
      />
    )

    unmount()
  })

  test('style', () => {
    const { unmount } = render(
      <AddButton
        disabled={mockDisabled()}
        primary
        light
        dark
        fullWidth
        needMargin
        loading={mockLoading()}
        onAdd={mockOnAdd}
      />
    )

    unmount()
  })

  test('onAdd', () => {
    const { unmount } = render(
      <AddButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        onAdd={mockOnAdd}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnAdd).toHaveBeenCalledTimes(1)

    unmount()
  })
})
