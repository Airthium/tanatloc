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
        organizations: [
          {
            id: 'id1',
            name: 'Organization 1',
            owners: [
              {
                id: 'id',
                email: 'owner'
              }
            ],
            users: [
              {
                id: 'id_user',
                email: 'user'
              }
            ],
            groups: [
              {
                id: 'id_group',
                name: 'Group 1'
              }
            ]
          },
          {
            id: 'id2',
            name: 'Organization 2',
            owners: [
              {
                id: 'id',
                email: 'owner'
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

    mockFetch.mockReset()

    mockCaptureException.mockReset()
  })

  test('onName', async () => {
    const { unmount } = render(<Dashboard />)

    // Set organization
    const org = screen.getAllByRole('button', { name: 'control Manage' })[0]
    fireEvent.click(org)

    // Typo
    const edit = screen.getByRole('button', { name: 'edit' })
    fireEvent.click(edit)

    const name = screen.getByRole('textbox')
    fireEvent.change(name, { target: { value: 'New name' } })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    fireEvent.keyDown(name, { keyCode: 13 })
    fireEvent.keyUp(name, { keyCode: 13 })

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
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/organization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: 'id1',
          data: [{ key: 'name', value: 'New name' }]
        })
      })
    )

    unmount()
  })

  test('new administrator', async () => {
    const { unmount } = render(<Dashboard />)

    // Set organization
    const org = screen.getAllByRole('button', { name: 'control Manage' })[0]
    fireEvent.click(org)

    // Add
    const add = screen.getByRole('button', { name: 'plus New administrator' })
    fireEvent.click(add)

    // Cancel
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(add)

    // Form
    const email = screen.getByLabelText('Email')
    fireEvent.change(email, { target: { value: 'email' } })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
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
      headers: {
        get: () => ''
      }
    }))
    fireEvent.click(ok)
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/organization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: 'id1',
          data: [
            { key: 'owners', type: 'array', method: 'append', value: 'email' }
          ]
        })
      })
    )

    unmount()
  })

  test('new user', async () => {
    const { unmount } = render(<Dashboard />)

    // Set organization
    const org = screen.getAllByRole('button', { name: 'control Manage' })[0]
    fireEvent.click(org)

    // Add
    const add = screen.getByRole('button', { name: 'plus New user' })
    fireEvent.click(add)

    // Cancel
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancel)

    fireEvent.click(add)

    // Form
    const email = screen.getByLabelText('Email')
    fireEvent.change(email, { target: { value: 'email' } })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
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
      headers: {
        get: () => ''
      }
    }))
    fireEvent.click(ok)
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/organization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: 'id1',
          data: [
            { key: 'users', type: 'array', method: 'append', value: 'email' }
          ]
        })
      })
    )

    unmount()
  })
})
