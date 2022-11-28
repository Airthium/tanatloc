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

const mockUpdate = jest.fn()
jest.mock('@/api/organization', () => ({
  update: async () => mockUpdate()
}))

describe('componenets/assets/organization/users/delete', () => {
  const disabled = false
  const user = { id: 'id', email: 'email' }
  const organization = {
    id: 'id',
    owners: [],
    pendingowners: [],
    users: [],
    pendingusers: [{ id: 'id', email: 'email' }]
  }
  const dBkey = 'pendingusers'
  const swr = {
    mutateOneOrganization: jest.fn()
  }

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Delete
        disabled={disabled}
        user={user}
        organization={organization}
        dBkey={dBkey}
        swr={swr}
      />
    )

    unmount()
  })

  test('with user data', () => {
    const { unmount } = render(
      <Delete
        disabled={disabled}
        user={{ ...user, firstname: 'firstname', lastname: 'lastname' }}
        organization={organization}
        dBkey={dBkey}
        swr={swr}
      />
    )

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
    const { unmount } = render(
      <Delete
        disabled={disabled}
        user={user}
        organization={organization}
        dBkey={dBkey}
        swr={swr}
      />
    )

    const button = screen.getByRole('DeleteButton')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.del,
        new Error('update error')
      )
    )

    unmount()
  })
})
