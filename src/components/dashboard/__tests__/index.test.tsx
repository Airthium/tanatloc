import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Dashboard from '@/components/dashboard'

const mockReplace = jest.fn()
const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    push: () => mockPush(),
    query: mockQuery()
  })
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('@/components/loading', () => () => <div />)

jest.mock('@/components/workspace/list', () => () => <div />)

jest.mock('@/components/account', () => () => <div />)

jest.mock('@/components/organizations', () => () => <div />)

jest.mock('@/components/administration', () => () => <div />)

jest.mock('@/components/help', () => () => <div />)

const mockUser = jest.fn()
const mockMutateUser = jest.fn()
const mockClearUser = jest.fn()
const mockErrorUser = jest.fn()
const mockLoadingUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    mockUser(),
    {
      mutateUser: mockMutateUser,
      clearUser: mockClearUser,
      errorUser: mockErrorUser(),
      loadingUser: mockLoadingUser()
    }
  ]
}))

const mockOrganizations = jest.fn()
const mockReloadOrganizations = jest.fn()
const mockAddOneOrganization = jest.fn()
const mockDelOneOrganization = jest.fn()
const mockMutateOneOrganization = jest.fn()
const mockErrorOrganizations = jest.fn()
const mockLoadingOrganizations = jest.fn()
jest.mock('@/api/organization', () => ({
  useOrganizations: () => [
    mockOrganizations(),
    {
      addOneOrganization: mockAddOneOrganization,
      delOneOrganization: mockDelOneOrganization,
      mutateOnOrganization: mockMutateOneOrganization,
      errorOrganizations: mockErrorOrganizations(),
      loadingOrganizations: mockLoadingOrganizations()
    }
  ]
}))

const mockWorkspaces = jest.fn()
const mockAddOneWorkspace = jest.fn()
const mockDelOneWorkspace = jest.fn()
const mockMutateOneWorkspace = jest.fn()
const mockErrorWorkspaces = jest.fn()
jest.mock('@/api/workspace', () => ({
  useWorkspaces: () => [
    mockWorkspaces(),
    {
      addOneWorkspace: mockAddOneWorkspace,
      delOneWorkspace: mockDelOneWorkspace,
      mutateOneWorkspace: mockMutateOneWorkspace,
      errorWorkspaces: mockErrorWorkspaces()
    }
  ]
}))

const mockLogout = jest.fn()
jest.mock('@/api/logout', () => ({
  logout: () => mockLogout()
}))

describe('components/dashboard', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockPush.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockErrorNotification.mockReset()

    mockUser.mockReset()
    mockUser.mockImplementation(() => ({ id: 'id', superuser: true }))
    mockMutateUser.mockReset()
    mockClearUser.mockReset()
    mockErrorUser.mockReset()
    mockLoadingUser.mockReset()

    mockOrganizations.mockReset()
    mockOrganizations.mockImplementation(() => [])
    mockReloadOrganizations.mockReset()
    mockAddOneOrganization.mockReset()
    mockDelOneOrganization.mockReset()
    mockMutateOneOrganization.mockReset()
    mockErrorOrganizations.mockReset()
    mockLoadingOrganizations.mockReset()

    mockWorkspaces.mockReset()
    mockWorkspaces.mockImplementation(() => [])
    mockAddOneWorkspace.mockReset()
    mockDelOneWorkspace.mockReset()
    mockMutateOneWorkspace.mockReset()
    mockErrorWorkspaces.mockReset()

    mockLogout.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('loading', () => {
    mockLoadingUser.mockImplementation(() => true)
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('page query - page === my_workspaces', () => {
    Object.defineProperty(global, 'URLSearchParams', {
      value: jest.fn().mockImplementation(() => ({
        get: (param: string) => {
          if (param === 'page') return 'my_workspaces'
        }
      })),
      configurable: true
    })
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('page query - page === my_workspace && workspaceId', () => {
    Object.defineProperty(global, 'URLSearchParams', {
      value: jest.fn().mockImplementation(() => ({
        get: (param: string) => {
          if (param === 'workspaceId') return 'id'
          if (param === 'page') return 'account'
        }
      })),
      configurable: true
    })
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('page query - page === account', () => {
    Object.defineProperty(global, 'URLSearchParams', {
      value: jest.fn().mockImplementation(() => ({
        get: (param: string) => {
          if (param === 'page') return 'account'
        }
      })),
      configurable: true
    })
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('errors', () => {
    mockErrorUser.mockImplementation(() => true)
    mockErrorOrganizations.mockImplementation(() => true)
    mockErrorWorkspaces.mockImplementation(() => true)
    const { unmount } = render(<Dashboard />)

    expect(mockErrorNotification).toHaveBeenCalledTimes(3)

    unmount()
  })

  test('user', () => {
    mockUser.mockImplementation(() => {
      // Empty user
    })
    const { unmount } = render(<Dashboard />)

    expect(mockReplace).toHaveBeenCalledTimes(2)

    unmount()
  })

  test('workspaces', () => {
    mockWorkspaces.mockImplementation(() => [
      { id: 'id1', owners: [{ id: 'id' }] },
      { id: 'id2', users: [{ id: 'id' }] },
      { id: 'id3', groups: [{ id: 'id' }] }
    ])
    mockOrganizations.mockImplementation(() => [
      { id: 'id', groups: [{ id: 'id' }] }
    ])
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('onSelect', () => {
    mockWorkspaces.mockImplementation(() => [
      { id: 'id1', name: 'workspace 1', owners: [{ id: 'id' }] },
      { id: 'id2', name: 'workspace 2', users: [{ id: 'id' }] }
    ])
    const { unmount } = render(<Dashboard />)

    const items = screen.getAllByRole('menuitem')
    items.forEach((item) => fireEvent.click(item))

    unmount()
  })

  test('onSelect (error + empty)', () => {
    mockPush.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(<Dashboard />)

    const items = screen.getAllByRole('menuitem')
    items.forEach((item) => fireEvent.click(item))

    unmount()
  })

  test('with git version', () => {
    Object.defineProperty(process.env, 'NEXT_PUBLIC_SOURCE_BRANCH', {
      value: 'dev'
    })
    Object.defineProperty(process.env, 'NEXT_PUBLIC_SOURCE_COMMIT', {
      value: 'hash'
    })

    const { unmount } = render(<Dashboard />)

    screen.getAllByText(/git-dev-hash/)

    unmount()
  })
})
