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

  // test('onAdd', () => {
  //   wrapper.find('Button').props().onClick()
  //   expect(mockOnAdd).toHaveBeenCalledTimes(1)
  // })
})
