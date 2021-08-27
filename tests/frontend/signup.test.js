import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Signup from '@/pages/signup'

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

describe('e2e/frontend/signup', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()

    mockSWR.mockReset()
    mockSWR.mockImplementation(() => ({
      data: { user: null, system: { allowsignup: true } },
      error: null,
      mutate: jest.fn
    }))

    mockFetch.mockReset()

    mockCaptureException.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Signup />)

    unmount()
  })

  test('render, loading', () => {
    mockSWR.mockImplementation(() => ({
      data: null,
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(<Signup />)

    unmount()
  })

  test('render, not allowed', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: null, system: null },
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(<Signup />)

    screen.getByText('The server does not allow signup for now')

    unmount()
  })

  test('user & system error', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: null, system: null },
      error: new Error('SWR error'),
      mutate: jest.fn
    }))
    const { unmount } = render(<Signup />)

    expect(mockCaptureException).toHaveBeenCalledTimes(2)
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('SWR error')
    )

    unmount()
  })

  test('user', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: {}, system: null },
      error: new Error('SWR error'),
      mutate: jest.fn
    }))
    const { unmount } = render(<Signup />)

    expect(mockRouterPush).toHaveBeenLastCalledWith('/dashboard')

    unmount()
  })

  test('signup', async () => {
    const { unmount } = render(<Signup />)

    const email = screen.getByLabelText('Enter your email address')
    const password = screen.getByLabelText('Choose your password')
    const confirm = screen.getByLabelText('Confirm your password')

    const button = screen.getByRole('button', { name: 'Finish' })

    // Empty
    fireEvent.click(button)

    // Password tests
    fireEvent.change(email, { target: { value: 'email' } })
    fireEvent.change(password, { target: { value: 'pass' } })
    fireEvent.change(password, { target: { value: 'passpasspasspasspass' } })
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.change(password, { target: { value: 'password1' } })
    fireEvent.change(password, { target: { value: 'password1&' } })
    fireEvent.change(confirm, { target: { value: 'password' } })
    fireEvent.change(confirm, { target: { value: 'password1' } })

    // Already exists
    mockFetch.mockImplementation(() => ({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({ alreadyExists: true })
    }))
    fireEvent.change(confirm, { target: { value: 'password1&' } })
    fireEvent.click(button)
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))

    // Login
    const login = screen.getByRole('button', { name: 'Log in ?' })
    fireEvent.click(login)
    expect(mockRouterPush).toHaveBeenLastCalledWith('/login')

    // Error
    mockFetch.mockImplementation(() => {
      throw new Error('Fetch error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
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
      json: () => ({ alreadyExists: false })
    }))
    fireEvent.click(button)
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(mockRouterPush).toHaveBeenLastCalledWith('/signup/send')
    )

    unmount()
  })
})
