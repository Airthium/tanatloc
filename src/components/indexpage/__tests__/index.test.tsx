import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import Index from '..'

jest.mock('@/components/assets/mathjax', () => ({
  Inline: () => <div />,
  Formula: () => <div />,
  Html: () => <div />
}))

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: (route: string) => mockPush(route)
  })
}))

jest.mock('@/components/background', () => () => <div />)

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUser = jest.fn()
const mockErrorUser = jest.fn()
const mockLoadingUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    mockUser(),
    { errorUser: mockErrorUser(), loadingUser: mockLoadingUser() }
  ]
}))

describe('components/index', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()

    mockError.mockReset()

    mockUser.mockReset()
    mockErrorUser.mockReset()
    mockLoadingUser.mockReset()
    mockLoadingUser.mockImplementation(() => false)
  })

  test('render', () => {
    const { unmount } = render(<Index />)

    unmount()
  })

  test('handleSignup', () => {
    let currentRoute: string
    mockPush.mockImplementation((route) => (currentRoute = route))

    const { unmount } = render(<Index />)
    fireEvent.click(screen.getByText(/Signup/))
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(currentRoute).toBe('/signup')

    unmount()
  })

  test('handleLogin', () => {
    let currentRoute: string
    mockPush.mockImplementation((route) => (currentRoute = route))

    const { unmount } = render(<Index />)
    fireEvent.click(screen.getByText(/Login/))
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(currentRoute).toBe('/login')

    unmount()
  })

  test('handleDashboard', () => {
    let currentRoute: string
    mockPush.mockImplementation((route) => (currentRoute = route))

    // Need user
    mockUser.mockImplementation(() => ({}))

    const { unmount } = render(<Index />)
    fireEvent.click(screen.getByText(/Dashboard/))
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(currentRoute).toBe('/dashboard')

    unmount()
  })

  test('errorUser', () => {
    mockErrorUser.mockImplementation(() => 'error')

    const { unmount } = render(<Index />)
    expect(mockError).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('loadingUser', () => {
    mockLoadingUser.mockImplementation(() => true)

    const { unmount } = render(<Index />)

    unmount()
  })

  test('with git version', () => {
    Object.defineProperty(process.env, 'NEXT_PUBLIC_SOURCE_BRANCH', {
      value: 'dev'
    })
    Object.defineProperty(process.env, 'NEXT_PUBLIC_SOURCE_COMMIT', {
      value: 'hash'
    })

    const { unmount } = render(<Index />)

    screen.getByText(/git-dev-hash/)

    unmount()
  })
})
