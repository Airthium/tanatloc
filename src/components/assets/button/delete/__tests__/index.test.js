import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import DeleteButton from '@/components/assets/button/delete'

jest.mock('@/components/assets/dialog', () => ({
  DeleteDialog: () => <div />
}))

describe('components/assets/button/delete', () => {
  const mockLoading = jest.fn(() => false)
  const mockOnDelete = jest.fn()

  test('render', () => {
    const { unmount } = render(
      <DeleteButton loading={mockLoading} onDelete={mockOnDelete} />
    )

    unmount()
  })

  // test('setVisible', () => {
  //   wrapper.find('Button').props().onClick()

  //   wrapper.find('DeleteDialog').props().onCancel()
  // })

  // test('onDelete', () => {
  //   wrapper.find('DeleteDialog').props().onOk()
  //   expect(mockOnDelete).toHaveBeenCalledTimes(1)
  // })
})
