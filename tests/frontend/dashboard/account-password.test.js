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
    return 'account'
  }
}))

describe('e2e/frontend/dashboard/account/password', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()
    mockRouterReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({ tab: 'security' }))

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

  test('change', async () => {
    const { unmount } = render(<Dashboard />)

    const password = screen.getByLabelText('Current password')
    const newPassword = screen.getByLabelText('New password')
    const confirm = screen.getByLabelText('Password confirmation')

    const button = screen.getByRole('button')

    // Fill form
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.change(newPassword, { target: { value: 'password1&' } })
    fireEvent.change(confirm, { target: { value: 'confirm' } })
    fireEvent.change(confirm, { target: { value: 'password1&' } })

    // Error
    mockFetch.mockImplementation(() => ({
      ok: false,
      status: 500,
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

    // Wrong check
    mockFetch.mockImplementation(() => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ valid: false })
    }))
    fireEvent.click(button)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user/check', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'email', password: 'password' })
      })
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ valid: true })
    }))
    fireEvent.click(button)

    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          {
            type: 'crypt',
            key: 'password',
            value: 'password1&'
          }
        ])
      })
    )

    unmount()
  })
})
