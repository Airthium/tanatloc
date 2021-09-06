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
    return 'organizations'
  }
}))

describe('e2e/frontend/dashboard/organizations', () => {
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

  test('with organizations', async () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: {
          id: 'id',
          email: 'email',
          authorizedplugins: [],
          superuser: true
        },
        users: null,
        organizations: [
          {
            id: 'id1',
            name: 'Organization 1',
            owners: [
              {
                id: 'id',
                email: 'admin'
              }
            ],
            users: [
              {
                id: 'id',
                email: 'email'
              }
            ],
            groups: [
              {
                id: 'id',
                name: 'group'
              }
            ]
          },
          {
            id: 'id2',
            name: 'Organization 2',
            owners: [
              {
                id: 'id',
                email: 'admin'
              }
            ],
            users: [],
            groups: []
          }
        ],
        workspaces: null
      },
      error: null,
      mutate: jest.fn
    }))

    const { unmount } = render(<Dashboard />)

    // Add
    const add = screen.getByRole('button', { name: 'plus New organization' })
    fireEvent.click(add)

    // Cancel
    let cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(add)

    // Form
    const name = screen.getByLabelText('Name')
    const ok = screen.getByRole('button', { name: 'OK' })

    // Empty
    fireEvent.click(ok)

    fireEvent.change(name, { target: { value: 'new name' } })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
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
        get: () => 'application/json'
      },
      json: () => ({})
    }))
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'new name' })
      })
    )

    // Sort
    const sorter = screen.getAllByText('Name')[0]
    fireEvent.click(sorter)

    // Delete
    const del = screen.getAllByRole('button', { name: 'delete' })[0]
    fireEvent.click(del)

    // Cancel
    cancel = screen.getAllByRole('button', { name: 'Cancel' })[0]
    fireEvent.click(cancel)

    fireEvent.click(del)
    const delOk = screen.getByRole('button', { name: 'Delete' })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    fireEvent.click(delOk)
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
        get: () => ''
      }
    }))
    fireEvent.click(delOk)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/organization', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: 'id1' })
      })
    )

    // Set organization
    const org = screen.getAllByRole('button', { name: 'control Manage' })[0]
    fireEvent.click(org)

    unmount()
  })
})
