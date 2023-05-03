import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form, Input } from 'antd'

import Signup, { errors } from '@/components/signup'

jest.mock('@/config/email', () => ({
  TOKEN: 'TOKEN'
}))

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async (route: string) => mockPush(route)
  })
}))

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => ({
  PasswordItem: (props: any) => mockPasswordItem(props)
}))

const mockErrorNotification = jest.fn()
const mockFormError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err),
  FormError: (props: any) => mockFormError(props)
}))

jest.mock('@/components/loading', () => () => <div />)

const mockAPIError = jest.fn()
jest.mock('@/api/error', () => ({
  APIError: jest.fn().mockImplementation((apiError) => mockAPIError(apiError))
}))

const mockUser = jest.fn()
const mockLoading = jest.fn()
const mockAdd = jest.fn()
const mockErrorUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    mockUser(),
    {
      loadingUser: mockLoading(),
      errorUser: mockErrorUser()
    }
  ],
  add: async (add: any) => mockAdd(add)
}))

const mockSystem = jest.fn()
const mockErrorSystem = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [
    mockSystem(),
    { loadingSystem: false, errorSystem: mockErrorSystem() }
  ]
}))

describe('components/signup', () => {
  beforeEach(() => {
    mockPush.mockReset()

    mockPasswordItem.mockReset()
    mockPasswordItem.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()
    mockFormError.mockReset()
    mockFormError.mockImplementation(() => <div />)

    mockAPIError.mockReset()
    mockAPIError.mockImplementation((apiError) => apiError)

    mockUser.mockReset()
    mockLoading.mockReset()
    mockAdd.mockReset()
    mockErrorUser.mockReset()

    mockSystem.mockReset()
    mockSystem.mockImplementation(() => ({
      allowsignup: true
    }))
    mockErrorSystem.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Signup />)

    unmount()
  })

  test('with user', () => {
    mockUser.mockImplementation(() => ({}))
    const { unmount } = render(<Signup />)
    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('errors', () => {
    mockErrorUser.mockImplementation(() => true)
    mockErrorSystem.mockImplementation(() => true)
    const { unmount } = render(<Signup />)
    expect(mockErrorNotification).toHaveBeenCalledTimes(2)

    unmount()
  })

  const mockPassword = () => {
    mockPasswordItem.mockImplementation((props) => (
      <Form.Item name={props.name} label={props.label}>
        <Input role="PasswordItem" />
      </Form.Item>
    ))
  }

  test('onSignup', async () => {
    mockPassword()
    mockFormError.mockImplementation((props) => (
      <div>{props.error?.render ?? null}</div>
    ))
    const { unmount } = render(<Signup />)

    const button = screen.getByRole('button')

    // Fill email & password
    const email = screen.getByLabelText('Enter your email address')
    const password = screen.getByRole('PasswordItem')
    const confirm = screen.getByLabelText('Confirm your password')

    await act(() =>
      fireEvent.change(email, { target: { value: 'email@email.email' } })
    )
    await act(() =>
      fireEvent.change(password, { target: { value: 'password' } })
    )
    await act(() =>
      fireEvent.change(confirm, { target: { value: 'password' } })
    )

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockAPIError).toHaveBeenCalledWith({
        title: errors.internal,
        err: new Error('add error')
      })
    )

    // Already exists
    mockAdd.mockImplementation(() => ({ alreadyExists: true }))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockAdd).toHaveBeenLastCalledWith({
        email: 'email@email.email',
        password: 'password',
        passwordConfirmation: 'password'
      })
    )
    await waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockAPIError).toHaveBeenLastCalledWith({
        title: errors.alreadyExists,
        render: expect.anything(),
        type: 'warning'
      })
    )

    // Log in
    await waitFor(() => screen.getByText('Log in ?'))
    const logIn = screen.getByText('Log in ?')
    await act(() => fireEvent.click(logIn))
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockPush).toHaveBeenLastCalledWith('/login'))

    // Normal
    mockAdd.mockImplementation(() => ({ alreadyExists: false }))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockPush).toHaveBeenLastCalledWith('/signup/send')
    )

    unmount()
  })

  test('mismatch passwords rule', async () => {
    mockPassword()
    const { unmount } = render(<Signup />)

    const password = screen.getByRole('PasswordItem')
    const confirm = screen.getByLabelText('Confirm your password')

    await act(() =>
      fireEvent.change(password, { target: { value: 'password' } })
    )
    await act(() =>
      fireEvent.change(confirm, { target: { value: 'other_password' } })
    )

    await waitFor(() => screen.getByText('Passwords mismatch'))

    unmount()
  })

  test('system', () => {
    mockSystem.mockImplementation(() => ({
      allowsignup: false
    }))
    const { unmount } = render(<Signup />)

    unmount()
  })
})
