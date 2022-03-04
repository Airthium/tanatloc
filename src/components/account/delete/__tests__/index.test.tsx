import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete, { errors } from '..'

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockDel = jest.fn()
jest.mock('@/api/user', () => ({
  del: async () => mockDel()
}))

const mockLogout = jest.fn()
jest.mock('@/api/logout', () => ({
  logout: async () => mockLogout()
}))

describe('components/account/delete', () => {
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div role="DeleteButton" />)

    mockDel.mockReset()

    mockLogout.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete swr={swr} />)

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation(({ onDelete }) => (
      <div onClick={onDelete} role="DeleteButton" />
    ))

    const { unmount } = render(<Delete swr={swr} />)

    const button = screen.getByRole('DeleteButton')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('del error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.del,
        new Error('del error')
      )
    )

    // Normal
    mockDel.mockImplementation(() => {
      // mock function
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(swr.mutateUser).toHaveBeenCalledTimes(1))

    unmount()
  })
})
