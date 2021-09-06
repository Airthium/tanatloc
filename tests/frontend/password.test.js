import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Password from '@/pages/password'

import { PASSWORD_RECOVERY } from '@/config/email'

// Next/router mock
const mockQuery = jest.fn()
const mockRouterPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: jest.fn(),
    query: mockQuery(),
    push: (route) => mockRouterPush(route)
  })
}))

// Fetch mock
const mockFetch = jest.fn()
global.fetch = (route, params) => mockFetch(route, params)

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/frontend/password', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))
    mockRouterPush.mockReset()

    mockFetch.mockReset()

    mockCaptureException.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Password />)

    expect(screen.getByText('Loading...'))

    unmount()
  })

  test('with id, link error', async () => {
    mockQuery.mockImplementation(() => ({ id: 'id' }))
    mockFetch.mockImplementation(() => ({
      ok: false,
      headers: {
        get: () => ''
      }
    }))
    const { unmount } = render(<Password />)

    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('An error occured while fetching data.')
      )
    )

    unmount()
  })

  test('with id, wrong link', async () => {
    mockQuery.mockImplementation(() => ({ id: 'id' }))
    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ type: 'other' })
    }))
    const { unmount } = render(<Password />)

    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/link', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: 'id', data: ['type', 'email'] })
      })
    )

    unmount()
  })

  test('with id', async () => {
    mockQuery.mockImplementation(() => ({ id: 'id' }))
    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ email: 'email', type: PASSWORD_RECOVERY })
    }))
    const { unmount } = render(<Password />)

    await waitFor(() => !screen.getByText('Loading...'))

    // Fill form
    const email = screen.getByLabelText('Enter your email address')
    const password = screen.getByLabelText('Choose your password')
    const confirm = screen.getByLabelText('Confirm your password')
    const ok = screen.getByRole('button')

    fireEvent.change(email, { target: { value: 'email1' } })
    fireEvent.change(password, { target: { value: 'password1&' } })
    fireEvent.change(confirm, { target: { value: 'password' } })
    fireEvent.change(confirm, { target: { value: 'password1&' } })

    // Wrong email
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('Incorrect data')
      )
    )

    // Correct email
    fireEvent.change(email, { target: { value: 'email' } })
    fireEvent.click(ok)
    await waitFor(() =>
      expect(mockFetch).toHaveBeenLastCalledWith('/api/link', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: 'id',
          data: { email: 'email', password: 'password1&' }
        })
      })
    )
    await waitFor(() =>
      expect(mockRouterPush).toHaveBeenLastCalledWith('/login')
    )

    unmount()
  })
})
