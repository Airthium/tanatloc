import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import Index, { errors } from '..'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: (route: string) => mockPush(route)
  })
}))

jest.mock('@/components/background', () => () => <div />)

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('@/components/assets/mathjax', () => ({
  Inline: () => <div />,
  Formula: () => <div />,
  Html: () => <div />
}))

const mockGetGitVersion = jest.fn()
jest.mock('@/lib/utils', () => ({
  getGitVersion: () => mockGetGitVersion()
}))

const mockUser = jest.fn()
const mockErrorNotificationUser = jest.fn()
const mockLoadingUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    mockUser(),
    { errorUser: mockErrorNotificationUser(), loadingUser: mockLoadingUser() }
  ]
}))

describe('components/index', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()

    mockErrorNotification.mockReset()

    mockGetGitVersion.mockReset()

    mockUser.mockReset()
    mockErrorNotificationUser.mockReset()
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
    mockErrorNotificationUser.mockImplementation(() => new Error('user error'))

    const { unmount } = render(<Index />)
    expect(mockErrorNotification).toHaveBeenCalledTimes(1)
    expect(mockErrorNotification).toHaveBeenCalledWith(
      errors.user,
      new Error('user error')
    )

    unmount()
  })

  test('loadingUser', () => {
    mockLoadingUser.mockImplementation(() => true)

    const { unmount } = render(<Index />)

    unmount()
  })

  test('with git version', () => {
    mockGetGitVersion.mockImplementation(() => 'git-dev-hash')

    const { unmount } = render(<Index />)

    screen.getByText(/git-dev-hash/)

    unmount()
  })
})
