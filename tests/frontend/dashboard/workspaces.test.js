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
    return 'workspaces'
  }
}))

describe('e2e/frontend/dashboard/workspaces', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()
    mockRouterReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))

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

  test('render, with workspaces', () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: { id: 'id', email: 'email', authorizedplugins: [] },
        organizations: null,
        workspaces: [{ id: 'id', name: 'Test workspace' }],
        projects: [
          {
            title: 'title1',
            description: '',
            avatar: '',
            owners: ['id'],
            users: [],
            groups: [],
            simulations: [],
            workspace: 'id'
          },
          {
            title: 'title1',
            description: '',
            avatar: '',
            owners: ['id0'],
            users: ['id'],
            groups: [],
            simulations: [],
            workspace: 'id'
          }
        ]
      },
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('add', async () => {
    const { unmount } = render(<Dashboard />)

    const adds = screen.getAllByRole('button', { name: 'Add tab' })

    // Open
    fireEvent.click(adds[0])

    // Cancel
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(adds[0])

    // Fill form
    const name = screen.getByLabelText('Name')
    fireEvent.change(name, { target: { value: 'New name' } })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      status: 500,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ error: true, message: 'Server error' })
    }))
    const ok = screen.getByRole('button', { name: 'OK' })
    fireEvent.click(ok)

    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({})
    }))
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/workspace', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'New name' })
      })
    )

    unmount()
  })

  test('edit', async () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: { id: 'id', email: 'email', authorizedplugins: [] },
        organizations: null,
        workspaces: [
          { id: 'id', name: 'Test workspace', owners: [{ id: 'id' }] }
        ]
      },
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(<Dashboard />)

    const edit = screen.getByRole('button', { name: 'edit' })

    // Open
    fireEvent.click(edit)

    // Cancel
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(edit)

    const ok = screen.getByRole('button', { name: 'OK' })

    // Error
    mockFetch.mockImplementation(() => {
      throw new Error('Fetch error')
    })
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('Fetch error')
      )
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({})
    }))
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/workspace', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workspace: { id: 'id' },
          data: [{ key: 'name', value: 'Test workspace' }]
        })
      })
    )

    unmount()
  })

  test('delete', async () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: { id: 'id', email: 'email', authorizedplugins: [] },
        organizations: null,
        workspaces: [
          { id: 'id', name: 'Test workspace', owners: [{ id: 'id' }] }
        ]
      },
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(<Dashboard />)

    const del = screen.getByRole('button', { name: 'delete' })

    // Open
    fireEvent.click(del)

    // Cancel
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(del)

    const ok = screen.getByRole('button', { name: 'Delete' })

    // Error
    mockFetch.mockImplementation(() => {
      throw new Error('Fetch error')
    })
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('Fetch error')
      )
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({})
    }))
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/workspace', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: 'id' })
      })
    )

    unmount()
  })
})
