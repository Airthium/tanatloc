import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Login from '@/components/login'

// Next/router mock
const mockRouterPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: jest.fn(),
    push: (route) => mockRouterPush(route)
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

describe('e2e/frontend/login', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()

    mockSWR.mockReset()
    mockSWR.mockImplementation(() => ({
      data: { user: null },
      error: null,
      mutate: jest.fn
    }))

    mockFetch.mockReset()

    mockCaptureException.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Login />)

    unmount()
  })

  test('render, loading', () => {
    mockSWR.mockImplementation(() => ({
      data: null,
      error: null,
      mutate: jest.fn
    }))

    const { unmount } = render(<Login />)

    unmount()
  })

  test('user error', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: null },
      error: new Error('SWR error'),
      mutate: jest.fn
    }))

    const { unmount } = render(<Login />)

    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('SWR error')
    )

    unmount()
  })

  test('routes, no user', () => {
    const { unmount } = render(<Login />)

    const buttons = screen.getAllByRole('button')

    // Signup
    fireEvent.click(buttons[0])
    expect(mockRouterPush).toHaveBeenLastCalledWith('/signup')

    unmount()
  })

  test('route, user', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: { id: 'id' } },
      error: new Error('SWR error'),
      mutate: jest.fn
    }))

    const { unmount } = render(<Login />)

    expect(mockRouterPush).toHaveBeenLastCalledWith('/dashboard')

    unmount()
  })

  test('login', async () => {
    const { unmount } = render(<Login />)

    const email = screen.getByLabelText('Your email address')
    const password = screen.getByLabelText('Your password')
    const button = screen.getByRole('button', { name: 'Log in' })

    // Empty
    fireEvent.click(button)

    // Not ok
    mockFetch.mockImplementation(() => ({
      status: 200,
      json: () => ({})
    }))
    fireEvent.change(email, { target: { value: 'email' } })
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.click(button)
    await waitFor(() => screen.getByText('Incorrect credentials.'))

    // Error
    mockFetch.mockImplementation(() => {
      throw new Error('Fetch error')
    })
    fireEvent.click(button)
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('Fetch error')
      )
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      status: 200,
      json: () => ({ ok: true })
    }))
    fireEvent.click(button)
    await waitFor(() =>
      expect(mockRouterPush).toHaveBeenLastCalledWith('/dashboard')
    )

    unmount()
  })

  test('password recovery', async () => {
    const { unmount } = render(<Login />)

    const button = screen.getByRole('button', {
      name: 'Forgot your password ?'
    })

    // Open
    fireEvent.click(button)

    const dialogOk = screen.getByRole('button', { name: 'OK' })
    const dialogCancel = screen.getByRole('button', { name: 'Cancel' })
    const email = screen.getAllByRole('textbox')[1]

    // Empty
    fireEvent.click(dialogOk)

    // Error
    fireEvent.change(email, { target: { value: 'email' } })
    mockFetch.mockImplementation(() => {
      throw new Error('Fetch error')
    })
    fireEvent.click(dialogOk)
    await waitFor(() =>
      expect(mockCaptureException).toHaveBeenLastCalledWith(
        new Error('Fetch error')
      )
    )

    // Normal
    mockFetch.mockImplementation(() => ({
      ok: true,
      headers: {
        get: jest.fn()
      }
    }))
    fireEvent.click(dialogOk)

    // Open / close
    fireEvent.click(button)
    fireEvent.click(dialogCancel)

    unmount()
  })
})
