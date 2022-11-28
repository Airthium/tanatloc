import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Login, { errors } from '@/components/login'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

jest.mock('@/components/loading', () => () => <div />)

const mockErrorNotification = jest.fn()
const mockFormError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err),
  FormError: () => mockFormError()
}))

const mockAPIError = jest.fn()
jest.mock('@/api/error', () => ({
  APIError: jest.fn().mockImplementation((apiError) => mockAPIError(apiError))
}))

const mockLogin = jest.fn()
jest.mock('@/api/login', () => ({
  login: async (login: any) => mockLogin(login)
}))

const mockUser = jest.fn()
const mockMutateUser = jest.fn()
const mockUserLoading = jest.fn()
const mockErrorNotificationUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    mockUser(),
    {
      mutateUser: mockMutateUser,
      errorUser: mockErrorNotificationUser(),
      loadingUser: mockUserLoading()
    }
  ]
}))

jest.mock('../password', () => () => <div />)

describe('components/login', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()

    mockIsElectron.mockReset()
    mockIsElectron.mockImplementation(() => false)

    mockErrorNotification.mockReset()
    mockFormError.mockReset()
    mockFormError.mockImplementation(() => <div />)

    mockAPIError.mockReset()

    mockLogin.mockReset()

    mockUser.mockReset()
    mockMutateUser.mockReset()
    mockUserLoading.mockReset()
    mockUserLoading.mockImplementation(() => false)
    mockErrorNotificationUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Login />)

    unmount()
  })

  test('electron', async () => {
    mockIsElectron.mockImplementation(() => true)
    const { unmount } = render(<Login />)

    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockPush).toHaveBeenLastCalledWith('/dashboard'))

    unmount()
  })

  test('loading', () => {
    mockUserLoading.mockImplementation(() => true)
    const { unmount } = render(<Login />)

    unmount()
  })

  test('error', () => {
    mockErrorNotificationUser.mockImplementation(() => true)
    const { unmount } = render(<Login />)

    expect(mockErrorNotification).toHaveBeenCalledTimes(1)
    expect(mockErrorNotification).toHaveBeenCalledWith(errors.user, true)

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

    // Error
    mockLogin.mockImplementation(() => {
      throw new Error('login error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'email',
        password: 'password'
      })
    )
    await waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockAPIError).toHaveBeenCalledWith({
        title: errors.internal,
        err: new Error('login error')
      })
    )

    // Not ok
    mockLogin.mockImplementation(() => ({ ok: false }))
    fireEvent.click(button)
    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockAPIError).toHaveBeenCalledWith({
        title: errors.credentials,
        type: 'warning'
      })
    )

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
