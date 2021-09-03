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
    mockQuery.mockImplementation(() => ({ tab: 'registration' }))

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
        workspaces: null,
        system: { allowsignup: false }
      },
      error: null,
      mutate: jest.fn
    }))

    mockFetch.mockReset()

    mockCaptureException.mockReset()
  })

  test('loading', () => {
    mockSWR.mockImplementation((route) => {
      if (route === '/api/system')
        return { data: null, error: null, mutate: jest.fn }
      return {
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
      }
    })
    const { unmount } = render(<Dashboard />)

    unmount()
  })

  test('system error', () => {
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
        workspaces: null,
        system: null
      },
      error: new Error('SWR error'),
      mutate: jest.fn
    }))
    const { unmount } = render(<Dashboard />)

    expect(mockCaptureException).toHaveBeenCalledTimes(8)

    unmount()
  })

  test('allow signup', async () => {
    const { unmount } = render(<Dashboard />)

    const checkboxes = screen.getAllByRole('checkbox')
    const checkbox = checkboxes[0]

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    fireEvent.click(checkbox)
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
    fireEvent.click(checkbox)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/system', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ key: 'allowsignup', value: true }])
      })
    )

    unmount()
  })

  test('password', async () => {
    const { unmount } = render(<Dashboard />)

    const button = screen.getByRole('button', { name: 'check' })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    fireEvent.click(button)
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
    fireEvent.click(button)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/system', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          {
            key: 'password',
            value: {
              min: 6,
              max: 16,
              requireLetter: true,
              requireNumber: true,
              requireSymbol: true
            }
          }
        ])
      })
    )

    unmount()
  })
})
