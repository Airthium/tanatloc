import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import DeleteButton from '@/components/assets/button/delete'

const mockDeleteDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => ({
  DeleteDialog: (props: any) => mockDeleteDialog(props)
}))

describe('components/assets/button/delete', () => {
  const mockLoading = jest.fn(() => false)
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    mockDeleteDialog.mockReset()
    mockDeleteDialog.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(
      <DeleteButton loading={mockLoading()} onDelete={mockOnDelete} />
    )

    unmount()
  })

  test('bordered', () => {
    const { unmount } = render(
      <DeleteButton loading={mockLoading()} bordered onDelete={mockOnDelete} />
    )

    unmount()
  })

  test('setVisible', () => {
    mockDeleteDialog.mockImplementation((props) => (
      <div role="DeleteDialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(
      <DeleteButton loading={mockLoading()} onDelete={mockOnDelete} />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('DeleteDialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onDelete', () => {
    mockDeleteDialog.mockImplementation((props) => (
      <div role="DeleteDialog" onClick={props.onOk} />
    ))
    const { unmount } = render(
      <DeleteButton loading={mockLoading()} onDelete={mockOnDelete} />
    )

    const dialog = screen.getByRole('DeleteDialog')
    fireEvent.click(dialog)
    expect(mockOnDelete).toHaveBeenCalledTimes(1)

    unmount()
  })
})
