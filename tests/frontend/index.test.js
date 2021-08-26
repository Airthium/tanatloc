import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Index from '@/components/index/index'

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

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/frontend/index', () => {
  beforeEach(() => {
    mockRouterPush.mockReset()

    mockSWR.mockReset()
    mockSWR.mockImplementation(() => ({
      data: { user: null },
      error: null,
      mutate: jest.fn
    }))

    mockCaptureException.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Index />)

    unmount()
  })

  test('render, loading', () => {
    mockSWR.mockImplementation(() => ({
      data: null,
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(<Index />)

    unmount()
  })

  test('user error', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: null },
      error: new Error('SWR error'),
      mutate: jest.fn
    }))

    const { unmount } = render(<Index />)

    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('SWR error')
    )

    unmount()
  })

  test('routes, no user', () => {
    const { unmount } = render(<Index />)

    const buttons = screen.getAllByRole('button')

    // Signup
    fireEvent.click(buttons[0])
    expect(mockRouterPush).toHaveBeenLastCalledWith('/signup')
    // Login
    fireEvent.click(buttons[1])
    expect(mockRouterPush).toHaveBeenLastCalledWith('/login')

    unmount()
  })

  test('routes, user', () => {
    mockSWR.mockImplementation(() => ({
      data: { user: { id: 'id', email: 'email' } },
      error: null,
      mutate: jest.fn
    }))

    const { unmount } = render(<Index />)

    const button = screen.getByRole('button')
    // Dashboard
    fireEvent.click(button)
    expect(mockRouterPush).toHaveBeenLastCalledWith('/dashboard')

    unmount()
  })
})
