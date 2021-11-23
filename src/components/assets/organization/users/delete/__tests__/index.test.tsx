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

const mockUpdate = jest.fn()
jest.mock('@/api/organization', () => ({
  update: async () => mockUpdate()
}))

describe('componenets/assets/organization/users/delete', () => {
  const disabled = false
  const user = { id: 'id', email: 'email' }
  const organization = { id: 'id', users: [{ id: 'id' }] }
  const dBkey = 'users'
  const swr = {
    mutateOneOrganization: jest.fn()
  }

  beforeEach(() => {
    mockDeleteDialog.mockReset()
    mockDeleteDialog.mockImplementation(() => <div />)

    mockError.mockReset()

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

  test('setVisible', () => {
    mockDeleteDialog.mockImplementation((props) => (
      <div role="DeleteDialog" onClick={props.onCancel} />
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
    const { unmount } = render(
      <Delete
        disabled={disabled}
        user={user}
        organization={organization}
        dBkey={dBkey}
        swr={swr}
      />
    )

    const dialog = screen.getByRole('DeleteDialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('propTypes', () => {
    let res
    const organizationProp = Delete.propTypes.organization

    res = organizationProp({}, 'organization', 'Delete')
    expect(res.message).toBe(
      'Invalid prop organization supplied to Delete. organization missing'
    )

    res = organizationProp({ organization: {} }, 'organization', 'Delete')
    expect(res.message).toBe(
      'Invalid prop organization supplied to Delete. id missing or invalid'
    )

    res = organizationProp(
      { organization: { id: 'id' }, dBkey: 'owners' },
      'organization',
      'Delete'
    )
    expect(res.message).toBe(
      'Invalid prop organization supplied to Delete. owners missing or invalid'
    )

    res = organizationProp(
      { organization: { id: 'id', owners: {} }, dBkey: 'owners' },
      'organization',
      'Delete'
    )
    expect(res.message).toBe(
      'Invalid prop organization supplied to Delete. owners missing or invalid'
    )

    res = organizationProp(
      { organization: { id: 'id', owners: [] }, dBkey: 'owners' },
      'organization',
      'Delete'
    )
    expect(res).toBe(undefined)

    res = organizationProp(
      { organization: { id: 'id' }, dBkey: 'users' },
      'organization',
      'Delete'
    )
    expect(res.message).toBe(
      'Invalid prop organization supplied to Delete. users missing or invalid'
    )

    res = organizationProp(
      { organization: { id: 'id', users: {} }, dBkey: 'users' },
      'organization',
      'Delete'
    )
    expect(res.message).toBe(
      'Invalid prop organization supplied to Delete. users missing or invalid'
    )

    res = organizationProp(
      { organization: { id: 'id', users: [] }, dBkey: 'users' },
      'organization',
      'Delete'
    )
    expect(res).toBe(undefined)
  })
})
