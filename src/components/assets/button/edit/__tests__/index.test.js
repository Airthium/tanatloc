import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import EditButton from '@/components/assets/button/edit'

describe('components/assets/button/add', () => {
  const mockDisabled = jest.fn(() => false)
  const mockLoading = jest.fn(() => false)
  const mockOnEdit = jest.fn()

  test('render', () => {
    const { unmount } = render(
      <EditButton
        disabled={mockDisabled()}
        loading={mockLoading()}
        onEdit={mockOnEdit}
      />
    )

    unmount()
  })

  // test('onEdit', () => {
  //   wrapper.find('Button').props().onClick()
  //   expect(mockOnEdit).toHaveBeenCalledTimes(1)
  // })
})
