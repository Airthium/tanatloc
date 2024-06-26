import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Login, { errors } from '@/components/login'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async (route: string) => mockPush(route)
  })
}))

jest.mock('@sentry/nextjs', () => ({ init: jest.fn }))

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

jest.mock('@airthium/tanatloc-3d', () => ({
  __esModule: true,
  default: { extra: { Background: () => <div /> } }
}))

jest.mock('next/dynamic', () => (callback: Function) => {
  callback()
  return () => <div />
})

jest.mock('@/components/loading', () => () => <div />)

const mockErrorNotification = jest.fn()
const mockFormError = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
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
    const { unmount, rerender } = render(<Login />)

    expect(mockPush).toHaveBeenCalledTimes(1)

    rerender(<Login />)
    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onLogin', async () => {
    const { unmount } = render(<Login />)

    const email = screen.getByLabelText('Your email address')
    const password = screen.getByLabelText('Your password')

    await act(() => fireEvent.change(email, { target: { value: 'email' } }))
    await act(() =>
      fireEvent.change(password, { target: { value: 'password' } })
    )

    const button = screen.getByRole('button', { name: 'Log in' })

    // Error
    mockLogin.mockImplementation(() => {
      throw new Error('login error')
    })
    await act(() => fireEvent.click(button))
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
    await act(() => fireEvent.click(button))
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
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(3))

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
