import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Dashboard from '@/pages/dashboard'

// Next/router mock
const mockRouterPush = jest.fn()
const mockRouterReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: jest.fn(),
    push: (route) => mockRouterPush(route),
    replace: (route) => mockRouterReplace(route),
    query: mockQuery()
  })
}))

// SWR mock
const mockSWR = jest.fn()
jest.mock('swr', () => () => mockSWR())

// Fetch mock
const mockFetch = jest.fn()
global.fetch = (route, params) => mockFetch(route, params)

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/frontend/dashboard', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()
    mockRouterReplace.mockReset()
    mockQuery.mockReset()

    mockSWR.mockReset()
    mockSWR.mockImplementation(() => ({
      data: {
        user: { id: 'id', email: 'email', authorizedplugins: [] },
        organizations: null,
        workspaces: null
      },
      error: null,
      mutate: jest.fn
    }))

    mockFetch.mockReset()

    mockCaptureException.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('render, loading', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: null, organizations: null, workspaces: null },
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('welcome page', () => {
    const originalURLSearchParms = global.URLSearchParams
    jest.spyOn(global, 'URLSearchParams').mockImplementationOnce(() => ({
      get: () => {
        return ''
      }
    }))
    let { unmount } = render(<Dashboard />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()

    global.URLSearchParams = originalURLSearchParms
  })

  test('workspaces page', () => {
    const originalURLSearchParms = global.URLSearchParams
    jest.spyOn(global, 'URLSearchParams').mockImplementationOnce(() => ({
      get: () => {
        return 'workspaces'
      }
    }))
    let { unmount } = render(<Dashboard />)

    unmount()

    global.URLSearchParams = originalURLSearchParms
  })

  test('account page', () => {
    mockQuery.mockImplementation(() => ({}))
    const originalURLSearchParms = global.URLSearchParams
    jest.spyOn(global, 'URLSearchParams').mockImplementationOnce(() => ({
      get: () => {
        return 'account'
      }
    }))
    let { unmount } = render(<Dashboard />)

    unmount()

    global.URLSearchParams = originalURLSearchParms
  })

  test('organizations page', () => {
    const originalURLSearchParms = global.URLSearchParams
    jest.spyOn(global, 'URLSearchParams').mockImplementationOnce(() => ({
      get: () => {
        return 'organizations'
      }
    }))
    let { unmount } = render(<Dashboard />)

    unmount()

    global.URLSearchParams = originalURLSearchParms
  })

  test('administration page', () => {
    mockQuery.mockImplementation(() => ({}))
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          email: 'email',
          authorizedplugins: [],
          superuser: true
        },
        organizations: null,
        workspaces: null
      },
      error: null,
      mutate: jest.fn
    }))
    const originalURLSearchParms = global.URLSearchParams
    jest.spyOn(global, 'URLSearchParams').mockImplementationOnce(() => ({
      get: () => {
        return 'administration'
      }
    }))
    let { unmount } = render(<Dashboard />)

    unmount()

    global.URLSearchParams = originalURLSearchParms
  })

  test('help page', () => {
    const originalURLSearchParms = global.URLSearchParams
    jest.spyOn(global, 'URLSearchParams').mockImplementationOnce(() => ({
      get: () => {
        return 'help'
      }
    }))
    let { unmount } = render(<Dashboard />)

    unmount()

    global.URLSearchParams = originalURLSearchParms
  })

  test('user, organizations & workspaces errors', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: null, organizations: null, workspaces: null },
      error: new Error('SWR error'),
      mutate: jest.fn
    }))
    const { unmount } = render(<Dashboard />)

    expect(mockCaptureException).toHaveBeenCalledTimes(6)
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('SWR error')
    )

    unmount()
  })

  test('no user', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: null, organizations: null, workspaces: null },
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(<Dashboard />)

    expect(mockRouterReplace).toHaveBeenCalledTimes(1)
    expect(mockRouterReplace).toHaveBeenLastCalledWith('/login')

    unmount()
  })

  test('menu select', async () => {
    mockQuery.mockImplementation(() => ({}))
    const { unmount } = render(<Dashboard />)

    const workspaces = screen.getByRole('menuitem', {
      name: 'appstore Workspaces'
    })
    const account = screen.getByRole('menuitem', {
      name: 'setting Account Settings'
    })
    const organizations = screen.getByRole('menuitem', {
      name: 'team Organizations'
    })
    const help = screen.getByRole('menuitem', {
      name: 'question-circle I Need Help'
    })
    const logout = screen.getByRole('menuitem', { name: 'logout Logout' })

    fireEvent.click(workspaces)
    expect(mockRouterReplace).toHaveBeenLastCalledWith({
      pathname: '/dashboard',
      query: { page: 'workspaces' }
    })

    fireEvent.click(account)
    expect(mockRouterReplace).toHaveBeenLastCalledWith({
      pathname: '/dashboard',
      query: { page: 'account' }
    })

    fireEvent.click(organizations)
    expect(mockRouterReplace).toHaveBeenLastCalledWith({
      pathname: '/dashboard',
      query: { page: 'organizations' }
    })

    fireEvent.click(help)
    expect(mockRouterReplace).toHaveBeenLastCalledWith({
      pathname: '/dashboard',
      query: { page: 'help' }
    })

    fireEvent.click(logout)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/logout', undefined)
    )
    await waitFor(() => expect(mockRouterPush).toHaveBeenLastCalledWith('/'))

    // Logout error
    mockFetch.mockImplementationOnce(() => {
      throw new Error('Fetch error')
    })
    fireEvent.click(logout)
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('Fetch error')
      )
    )

    unmount()
  })
})
