import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockDeleteDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = (props) => mockDeleteDialog(props)
  return { DeleteDialog }
})

const mockDel = jest.fn()
jest.mock('@/api/user', () => ({
  del: async () => mockDel()
}))

const mockLogout = jest.fn()
jest.mock('@/api/logout', () => async () => mockLogout())

let wrapper
describe('components/account/delete', () => {
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockDeleteDialog.mockReset()
    mockDeleteDialog.mockImplementation(() => <div role="DeleteDialog" />)

    mockDel.mockReset()

    mockLogout.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockDeleteDialog.mockImplementation(({ onCancel }) => (
      <div onClick={onCancel} role="DeleteDialog" />
    ))

    const { unmount } = render(<Delete swr={swr} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const deleteDialog = screen.getByRole('DeleteDialog')
    fireEvent.click(deleteDialog)

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteDialog.mockImplementation(({ onOk }) => (
      <div onClick={onOk} role="DeleteDialog" />
    ))

    const { unmount } = render(<Delete swr={swr} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const deleteDialog = screen.getByRole('DeleteDialog')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(deleteDialog)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    mockDel.mockImplementation(() => {})
    fireEvent.click(deleteDialog)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(swr.mutateUser).toHaveBeenCalledTimes(1))

    unmount()
  })
})
