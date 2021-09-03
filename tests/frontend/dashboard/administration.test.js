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

// URLSearchParams mock
jest.spyOn(global, 'URLSearchParams').mockImplementation(() => ({
  get: () => {
    return 'administration'
  }
}))

describe('e2e/frontend/dashboard/administration', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()
    mockRouterReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

    mockSWR.mockReset()
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          email: 'email',
          authorizedplugins: [],
          superuser: true
        },
        users: null,
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

  test('users error', () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          email: 'email',
          authorizedplugins: [],
          superuser: true
        },
        users: null,
        organizations: null,
        workspaces: null
      },
      error: new Error('SWR error'),
      mutate: jest.fn
    }))
    const { unmount } = render(<Dashboard />)

    expect(mockCaptureException).toHaveBeenCalledTimes(7)

    unmount()
  })

  test('users tab', () => {
    mockQuery.mockImplementation(() => ({ tab: 'users' }))
    const { unmount } = render(<Dashboard />)

    screen.getByRole('tabpanel', { name: 'Users' })

    unmount()
  })

  test('add user', async () => {
    const { unmount } = render(<Dashboard />)

    const tab = screen.getByRole('tab', { name: 'Users' })
    fireEvent.click(tab)

    const button = screen.getByRole('button', { name: 'plus New user' })
    fireEvent.click(button)

    // Cancel
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(button)

    const firstname = screen.getByLabelText('First name')
    const lastname = screen.getByLabelText('Last name')
    const email = screen.getByLabelText('Email')
    const password = screen.getByLabelText('Password')
    const plugins = screen.getByLabelText('Plugins')
    const superuser = screen.getByLabelText('Administrator')

    fireEvent.change(firstname, { target: { value: 'firstname' } })
    fireEvent.change(lastname, { target: { value: 'lastname' } })
    fireEvent.change(email, { target: { value: 'email' } })
    fireEvent.change(password, { target: { value: 'password1&' } })
    fireEvent.change(plugins, { target: { value: 'local' } })
    fireEvent.click(superuser)

    const ok = screen.getByRole('button', { name: 'OK' })

    // Already exists
    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ alreadyExists: true })
    }))
    fireEvent.click(ok)

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'email', password: 'password1&' })
      })
    )
    await waitFor(() => expect(mockCaptureException).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('User already exists')
      )
    )

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    fireEvent.click(ok)

    await waitFor(() => expect(mockCaptureException).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ id: 'id' })
    }))
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenNthCalledWith(4, '/api/user/id', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          { key: 'firstname', value: 'firstname' },
          { key: 'lastname', value: 'lastname' },
          { key: 'authorizedplugins', value: undefined },
          { key: 'superuser', value: true }
        ])
      })
    )

    unmount()
  })

  test('edit user', async () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          email: 'email',
          authorizedplugins: [],
          superuser: true
        },
        users: [{ id: 'id2', email: 'email' }],
        organizations: null,
        workspaces: null
      },
      error: null,
      mutate: jest.fn
    }))
    mockQuery.mockImplementation(() => ({ tab: 'users' }))

    const { unmount } = render(<Dashboard />)

    const edit = screen.getByRole('button', { name: 'edit Edit' })
    fireEvent.click(edit)

    // Cancel
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(edit)

    // Fill
    const firstname = screen.getByLabelText('First name')
    const lastname = screen.getByLabelText('Last name')
    const email = screen.getByLabelText('Email')
    const password = screen.getByLabelText('Password')
    const plugins = screen.getByLabelText('Plugins')
    const superuser = screen.getByLabelText('Administrator')

    fireEvent.change(firstname, { target: { value: 'firstname' } })
    fireEvent.change(lastname, { target: { value: 'lastname' } })
    fireEvent.change(email, { target: { value: 'email' } })
    fireEvent.change(password, { target: { value: 'password1&' } })
    fireEvent.change(plugins, { target: { value: 'local' } })
    fireEvent.click(superuser)

    const ok = screen.getByRole('button', { name: 'OK' })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    fireEvent.click(ok)
    await waitFor(() => expect(mockCaptureException).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => ''
      }
    }))
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user/id2', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          { key: 'authorizedplugins', value: [], type: false }
        ])
      })
    )

    unmount()
  })

  test('delete user', async () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          email: 'email',
          authorizedplugins: [],
          superuser: true
        },
        users: [{ id: 'id2', email: 'email' }],
        organizations: null,
        workspaces: null
      },
      error: null,
      mutate: jest.fn
    }))
    mockQuery.mockImplementation(() => ({ tab: 'users' }))

    const { unmount } = render(<Dashboard />)

    const del = screen.getByRole('button', { name: 'delete' })
    fireEvent.click(del)

    // Cancel
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(del)

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    const ok = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(ok)

    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => ''
      }
    }))
    fireEvent.click(ok)

    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user/id2', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    )

    unmount()
  })

  test('sort', () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          email: 'email',
          authorizedplugins: [],
          superuser: true
        },
        users: [
          { id: 'id2', email: 'email' },
          {
            id: 'id3',
            email: 'email',
            authorizedplugins: ['local'],
            superuser: true
          }
        ],
        organizations: null,
        workspaces: null
      },
      error: null,
      mutate: jest.fn
    }))
    mockQuery.mockImplementation(() => ({ tab: 'users' }))

    const { unmount } = render(<Dashboard />)

    const sorter1 = screen.getByText('First name')
    fireEvent.click(sorter1)

    const sorter2 = screen.getByText('Last name')
    fireEvent.click(sorter2)

    const sorter3 = screen.getByText('Email')
    fireEvent.click(sorter3)

    unmount()
  })
})
