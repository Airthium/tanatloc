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

const mockDelById = jest.fn()
jest.mock('@/api/user', () => ({
  delById: async () => mockDelById()
}))

describe('components/administration/users/delete', () => {
  const user = { id: 'id', email: 'email' }
  const swr = { delOneUser: jest.fn() }

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockDelById.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete user={user} swr={swr} />)

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div
        role="DeleteButton"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(<Delete user={user} swr={swr} />)

    const button = screen.getByRole('DeleteButton')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockDelById).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.delOneUser).toHaveBeenCalledTimes(1))

    // Error
    mockDelById.mockImplementation(() => {
      throw new Error('del error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockDelById).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.del,
        new Error('del error')
      )
    )

    unmount()
  })
})
