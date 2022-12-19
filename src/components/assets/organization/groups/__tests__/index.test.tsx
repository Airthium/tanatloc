import { render, screen, waitFor } from '@testing-library/react'

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
    owners: [],
    users: [],
    groups: []
  }
  const swr = {
    mutateOneOrganization: jest.fn()
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockUserToAvatar.mockReset()

    mockGroups.mockReset()
    const groups = [
      {
        id: 'id',
        name: 'name',
        users: [{}]
      }
    ]
    mockGroups.mockImplementation(() => groups)
  })

  test('render', () => {
    const { unmount } = render(<Groups organization={organization} swr={swr} />)

    unmount()
  })

  test('error', () => {
    mockErrorNotificationGroups.mockImplementation(() => true)
    const { unmount } = render(<Groups organization={organization} swr={swr} />)

    expect(mockErrorNotification).toHaveBeenCalledTimes(1)
    expect(mockErrorNotification).toHaveBeenLastCalledWith(errors.groups, true)

    unmount()
  })

  test('with owners & users', () => {
    const { unmount } = render(
      <Groups
        organization={{
          ...organization,
          owners: [
            {
              id: 'id1',
              email: 'email',
              firstname: 'firstname',
              lastname: 'lastname'
            }
          ],
          users: [
            { id: 'id2', email: 'email' },
            { id: 'id3', email: 'email' }
          ]
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('onResize', () => {
    Object.defineProperty(Element.prototype, 'clientHeight', {
      value: '1000'
    })

    const { unmount } = render(<Groups organization={organization} swr={swr} />)

    waitFor(() => screen.getByText('name'))

    unmount()
  })
})
