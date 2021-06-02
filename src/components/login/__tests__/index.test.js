import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Login from '@/components/login'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

jest.mock('@/components/loading', () => () => <div />)

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockLogin = jest.fn()
jest.mock('@/api/login', () => async () => mockLogin())

const mockUser = jest.fn()
const mockMutateUser = jest.fn()
const mockUserLoading = jest.fn()
const mockErrorUser = jest.fn()
jest.mock('@/api/user/useUser', () => () => [
  mockUser(),
  {
    mutateUser: mockMutateUser,
    errorUser: mockErrorUser(),
    loadingUser: mockUserLoading()
  }
])

describe('components/login', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()

    mockError.mockReset()

    mockLogin.mockReset()

    mockUser.mockReset()
    mockMutateUser.mockReset()
    mockUserLoading.mockReset()
    mockUserLoading.mockImplementation(() => false)
    mockErrorUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Login />)

    unmount()
  })

  test('loading', () => {
    mockUserLoading.mockImplementation(() => true)
    const { unmount } = render(<Login />)

    unmount()
  })

  test('error', () => {
    mockErrorUser.mockImplementation(() => true)
    const { unmount } = render(<Login />)

    expect(mockError).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('user', () => {
    mockUser.mockImplementation(() => ({}))
    const { unmount } = render(<Login />)

    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onLogin', async () => {
    const { unmount } = render(<Login />)

    const email = screen.getByLabelText('Your email address')
    const password = screen.getByLabelText('Your password')

    fireEvent.change(email, { target: { value: 'email' } })
    fireEvent.change(password, { target: { value: 'password' } })

    const button = screen.getByRole('button', { name: 'Log in' })

    // Not ok
    mockLogin.mockImplementation(() => ({}))
    fireEvent.click(button)
    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1))

    // Error
    mockLogin.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Ok
    mockLogin.mockImplementation(() => ({ ok: true }))
    fireEvent.click(button)
    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('signup', () => {
    const { unmount } = render(<Login />)
    const button = screen.getByRole('button', { name: 'Sign up' })
    fireEvent.click(button)
    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })
})
