import React from 'react'
import { render } from '@testing-library/react'

import Groups, { errors } from '..'

jest.mock('@/components/assets/group', () => {
  const Group = () => <div />
  const Delete = () => <div />

  Group.Delete = Delete
  return Group
})

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockUserToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar()
}))

const mockGroups = jest.fn()
const mockAddOneGroup = jest.fn()
const mockMutateOneGroup = jest.fn()
const mockDelOneGroup = jest.fn()
const mockErrorNotificationGroups = jest.fn()
const mockLoadingGroups = false
jest.mock('@/api/group', () => ({
  useGroups: () => [
    mockGroups(),
    {
      addOneGroup: mockAddOneGroup,
      mutateOneGroup: mockMutateOneGroup,
      delOneGroup: mockDelOneGroup,
      errorGroups: mockErrorNotificationGroups(),
      loadingGroups: mockLoadingGroups
    }
  ]
}))

describe('components/assets/organization/groups', () => {
  const organization = {
    id: 'id',
    owners: []
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockUserToAvatar.mockReset()

    mockGroups.mockReset()
    mockGroups.mockImplementation(() => [
      {
        id: 'id',
        name: 'name',
        users: [{}]
      }
    ])
  })

  test('render', () => {
    const { unmount } = render(<Groups organization={organization} />)

    unmount()
  })

  test('error', () => {
    mockErrorNotificationGroups.mockImplementation(() => true)
    const { unmount } = render(<Groups organization={organization} />)

    expect(mockErrorNotification).toHaveBeenCalledTimes(1)
    expect(mockErrorNotification).toHaveBeenLastCalledWith(errors.groups, true)

    unmount()
  })

  test('with owners & users', () => {
    const { unmount } = render(
      <Groups
        organization={{
          ...organization,
          owners: [{ id: 'id1', firstname: 'firstname', lastname: 'lastname' }],
          users: [{ id: 'id2', email: 'email' }, {}]
        }}
      />
    )

    unmount()
  })
})
