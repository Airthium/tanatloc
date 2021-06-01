import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Users from '..'

jest.mock('../add', () => () => <div />)

jest.mock('../delete', () => () => <div />)

const mockUserToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar()
}))

describe('components/assets/organization/users', () => {
  const organization = {
    id: 'id',
    owners: [{}]
  }
  const swr = {
    mutateOneOrganization: jest.fn(),
    loadingOrganizations: jest.fn()
  }

  beforeEach(() => {
    mockUserToAvatar.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Users organization={organization} swr={swr} />)

    unmount()
  })

  test('with users', () => {
    const { unmount } = render(
      <Users organization={{ ...organization, users: [{}] }} swr={swr} />
    )

    unmount()
  })
})
