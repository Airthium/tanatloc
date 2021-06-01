import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete from '..'

const mockDeleteDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => ({
  DeleteDialog: (props) => mockDeleteDialog(props)
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockDel = jest.fn()
jest.mock('@/api/group', () => ({
  del: async () => mockDel()
}))

describe('components/administration/groups/delete', () => {
  const group = { id: 'id', name: 'name' }
  const swr = {
    reloadOrganizations: jest.fn(),
    delOneGroup: jest.fn()
  }

  beforeEach(() => {
    mockDeleteDialog.mockReset()
    mockDeleteDialog.mockImplementation(() => <div />)
    mockError.mockReset()

    mockDel.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete group={group} swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockDeleteDialog.mockImplementation((props) => (
      <div role="DeleteDialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Delete group={group} swr={swr} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('DeleteDialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteDialog.mockImplementation((props) => (
      <div role="DeleteDialog" onClick={props.onOk} />
    ))
    const { unmount } = render(<Delete group={group} swr={swr} />)

    const dialog = screen.getByRole('DeleteDialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.delOneGroup).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.reloadOrganizations).toHaveBeenCalledTimes(1)
    )

    // Error
    mockDel.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
