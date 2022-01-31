import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import List from '..'

jest.mock('../../delete', () => () => <div />)

const mockUserToAvatar = jest.fn()
const mockGroupToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar(),
  groupToAvatar: () => mockGroupToAvatar()
}))

describe('components/organizations/list', () => {
  const user = { id: 'id1' }
  const organizations = [
    {
      id: 'id1',
      name: 'Name1',
      owners: [{ id: 'id1' }],
      users: [{ id: 'id1' }],
      groups: [{ id: 'id1' }]
    },
    {
      id: 'id2',
      name: 'Name2',
      owners: [{ id: 'id2' }],
      users: [{ id: 'id2' }],
      groups: [{ id: 'id2' }]
    }
  ]
  const swr = {
    delOneOrganization: jest.fn(),
    loadingOrganizations: false
  }
  const setOrganization = jest.fn()

  beforeEach(() => {
    mockUserToAvatar.mockReset()
    mockGroupToAvatar.mockReset()

    swr.delOneOrganization.mockReset()
    setOrganization.mockReset()
  })

  test('render', async () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={organizations}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    await waitFor(() => expect(mockUserToAvatar).toHaveBeenCalled())
    await waitFor(() => expect(mockGroupToAvatar).toHaveBeenCalled())

    unmount()
  })

  test('columns', () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={organizations}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    // Set organization
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(setOrganization).toHaveBeenCalledTimes(1)

    // Sorter
    const sorter = screen.getByText('Name')
    fireEvent.click(sorter)

    unmount()
  })

  test('without name', () => {
    const { unmount } = render(
      <List
        user={user}
        organizations={[
          {
            id: 'id1',
            name: undefined,
            owners: [{ id: 'id1' }],
            users: [{ id: 'id1' }],
            groups: [{ id: 'id1' }]
          },
          {
            id: 'id2',
            name: undefined,
            owners: [{ id: 'id2' }],
            users: [{ id: 'id2' }],
            groups: [{ id: 'id2' }]
          }
        ]}
        swr={swr}
        setOrganization={setOrganization}
      />
    )

    // Set organization
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(setOrganization).toHaveBeenCalledTimes(1)

    // Sorter
    const sorter = screen.getByText('Name')
    fireEvent.click(sorter)

    unmount()
  })
})
