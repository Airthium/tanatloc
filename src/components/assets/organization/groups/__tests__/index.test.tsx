import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Groups from '..'

jest.mock('@/components/assets/group', () => {
  const Group = () => <div />
  const Delete = () => <div />

  Group.Delete = Delete
  return Group
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUserToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar()
}))

const mockGroups = jest.fn()
const mockAddOneGroup = jest.fn()
const mockMutateOneGroup = jest.fn()
const mockDelOneGroup = jest.fn()
const mockErrorGroups = jest.fn()
const mockLoadingGroups = false
jest.mock('@/api/group', () => ({
  useGroups: () => [
    mockGroups(),
    {
      addOneGroup: mockAddOneGroup,
      mutateOneGroup: mockMutateOneGroup,
      delOneGroup: mockDelOneGroup,
      errorGroups: mockErrorGroups(),
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
    mockError.mockReset()

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
    mockErrorGroups.mockImplementation(() => true)
    const { unmount } = render(<Groups organization={organization} />)

    expect(mockError).toHaveBeenCalledTimes(1)

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
