import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Delete from '..'

jest.mock('@/components/assets/dialog', () => {
  const DeleteDialog = () => <div />
  return {
    DeleteDialog
  }
})

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

  // test('with user data', () => {
  //   wrapper.unmount()
  //   wrapper = shallow(
  //     <Delete
  //       disabled={disabled}
  //       user={{
  //         ...user,
  //         firstname: 'firstname'
  //       }}
  //       organization={organization}
  //       dBkey={dBkey}
  //       swr={swr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()

  //   wrapper.unmount()
  //   wrapper = shallow(
  //     <Delete
  //       disabled={disabled}
  //       user={{
  //         ...user,
  //         lastname: 'lastname'
  //       }}
  //       organization={organization}
  //       dBkey={dBkey}
  //       swr={swr}
  //     />
  //   )
  //   expect(wrapper).toBeDefined()
  // })

  // test('setVisible', () => {
  //   // Visible
  //   wrapper.find('Button').props().onClick()

  //   // Not visible
  //   wrapper.find('DeleteDialog').props().onCancel()
  // })

  // test('onDelete', async () => {
  //   // Normal
  //   await wrapper.find('DeleteDialog').props().onOk()
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('DeleteDialog').props().onOk()
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(swr.mutateOneOrganization).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })

  // test('propTypes', () => {
  //   let res
  //   const organizationProp = Delete.propTypes.organization

  //   res = organizationProp({}, 'organization', 'Delete')
  //   expect(res.message).toBe(
  //     'Invalid prop organization supplied to Delete. organization missing'
  //   )

  //   res = organizationProp({ organization: {} }, 'organization', 'Delete')
  //   expect(res.message).toBe(
  //     'Invalid prop organization supplied to Delete. id missing or invalid'
  //   )

  //   res = organizationProp(
  //     { organization: { id: 'id' }, dBkey: 'owners' },
  //     'organization',
  //     'Delete'
  //   )
  //   expect(res.message).toBe(
  //     'Invalid prop organization supplied to Delete. owners missing or invalid'
  //   )

  //   res = organizationProp(
  //     { organization: { id: 'id', owners: {} }, dBkey: 'owners' },
  //     'organization',
  //     'Delete'
  //   )
  //   expect(res.message).toBe(
  //     'Invalid prop organization supplied to Delete. owners missing or invalid'
  //   )

  //   res = organizationProp(
  //     { organization: { id: 'id', owners: [] }, dBkey: 'owners' },
  //     'organization',
  //     'Delete'
  //   )
  //   expect(res).toBe()

  //   res = organizationProp(
  //     { organization: { id: 'id' }, dBkey: 'users' },
  //     'organization',
  //     'Delete'
  //   )
  //   expect(res.message).toBe(
  //     'Invalid prop organization supplied to Delete. users missing or invalid'
  //   )

  //   res = organizationProp(
  //     { organization: { id: 'id', users: {} }, dBkey: 'users' },
  //     'organization',
  //     'Delete'
  //   )
  //   expect(res.message).toBe(
  //     'Invalid prop organization supplied to Delete. users missing or invalid'
  //   )

  //   res = organizationProp(
  //     { organization: { id: 'id', users: [] }, dBkey: 'users' },
  //     'organization',
  //     'Delete'
  //   )
  //   expect(res).toBe()
  // })
})
