import React from 'react'
import { render } from '@testing-library/react'

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
    loadingOrganizations: false
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

  test('with pendings', () => {
    const { unmount } = render(
      <Users
        organization={{
          ...organization,
          pendingowners: [{}],
          users: [{}],
          pendingusers: [{}]
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('onResize', async () => {
    jest
      .spyOn(Element.prototype, 'clientHeight', 'get')
      .mockImplementationOnce(() => 1000)
      .mockImplementationOnce(() => 250)
      .mockImplementationOnce(() => 250)

    const { unmount } = render(<Users organization={organization} swr={swr} />)

    unmount()
  })
})
