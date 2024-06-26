import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Dashboard from '@/components/dashboard'

const mockReplace = jest.fn()
const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    push: async () => mockPush(),
    query: mockQuery()
  })
}))

jest.mock('@sentry/nextjs', () => ({ init: jest.fn }))

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
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

const mockLogin = jest.fn()
jest.mock('@/api/login', () => ({
  login: async () => mockLogin()
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

    mockIsElectron.mockReset()
    mockIsElectron.mockImplementation(() => false)

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

    mockLogin.mockReset()

    mockLogout.mockReset()
  })

  test('render', () => {
    mockUser.mockImplementation(() => ({ id: 'id', superuser: false }))
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('electron', () => {
    mockIsElectron.mockImplementation(() => true)
    mockUser.mockImplementation(() => ({ id: 'id', superuser: true }))
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

    expect(mockReplace).toHaveBeenCalledTimes(1)

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
    const { unmount } = render(<Dashboard />)

    const items = screen.getAllByRole('menuitem')
    items.forEach((item) => fireEvent.click(item))

    unmount()
  })

  test('logout error', async () => {
    const { unmount } = render(<Dashboard />)

    mockLogout.mockImplementation(() => {
      throw new Error('logout error')
    })

    const logout = screen.getByRole('img', { name: 'logout' })
    await act(() => fireEvent.click(logout))

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        'Unable to logout',
        new Error('logout error')
      )
    )

    unmount()
  })
})
