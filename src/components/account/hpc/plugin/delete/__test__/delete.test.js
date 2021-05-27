import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete from '..'

const mockDeleteDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = (props) => mockDeleteDialog(props)
  return { DeleteDialog }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockDel = jest.fn()
jest.mock('@/api/plugin', () => ({
  del: () => mockDel()
}))

describe('components/account/hpc/delete', () => {
  const plugin = {}
  const swr = {
    delOnePlugin: jest.fn()
  }

  beforeEach(() => {
    mockDeleteDialog.mockReset()
    mockDeleteDialog.mockImplementation(() => <div role="DeleteDialog" />)

    mockError.mockReset()

    mockDel.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete plugin={plugin} swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockDeleteDialog.mockImplementation(({ onCancel }) => (
      <div role="DeleteDialog" onClick={onCancel} />
    ))

    const { unmount } = render(<Delete plugin={plugin} swr={swr} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    const deleteDialog = screen.getByRole('DeleteDialog')
    fireEvent.click(deleteDialog)

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteDialog.mockImplementation(({ onOk }) => (
      <div role="DeleteDialog" onClick={onOk} />
    ))

    const { unmount } = render(<Delete plugin={plugin} swr={swr} />)
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
    await waitFor(() => expect(swr.delOnePlugin).toHaveBeenCalledTimes(1))

    unmount()
  })
})
