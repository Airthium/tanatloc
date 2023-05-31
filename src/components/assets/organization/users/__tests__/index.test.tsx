import { render } from '@testing-library/react'

import { IFrontUserModel } from '@/api/index.d'

import Users from '..'

jest.mock('../add', () => () => <div />)

jest.mock('../delete', () => () => <div />)

const mockUserToAvatar = jest.fn()
jest.mock('@/lib/utils', () => ({
  userToAvatar: () => mockUserToAvatar(),
  workspaceToAvatar: jest.fn(),
  projectToAvatar: jest.fn(),
  usermodelToAvatar: jest.fn()
}))

describe('components/assets/organization/users', () => {
  const organization = {
    id: 'ido',
    owners: [
      {
        id: 'idu',
        email: 'email',
        workspaces: [],
        projects: [],
        usermodels: []
      }
    ],
    pendingowners: [],
    users: [],
    pendingusers: []
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
      <Users
        organization={{
          ...organization,
          users: [
            {
              id: 'idu',
              email: 'email',
              workspaces: [{ id: 'id', name: 'name' }],
              projects: [{ id: 'id', title: 'title' }],
              usermodels: [
                { id: 'id', model: { name: 'name' } } as IFrontUserModel
              ]
            }
          ]
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('with pendings', () => {
    const { unmount } = render(
      <Users
        organization={{
          ...organization,
          pendingowners: [{ id: 'idpo', email: 'email' }],
          users: [
            {
              id: 'ido',
              email: 'email',
              workspaces: [],
              projects: [],
              usermodels: []
            }
          ],
          pendingusers: [{ id: 'idpu', email: 'email' }]
        }}
        swr={swr}
      />
    )

    unmount()
  })

  test('onResize', () => {
    jest
      .spyOn(Element.prototype, 'clientHeight', 'get')
      .mockImplementationOnce(() => 1000)
      .mockImplementationOnce(() => 250)
      .mockImplementationOnce(() => 250)

    const { unmount } = render(<Users organization={organization} swr={swr} />)

    unmount()
  })
})
