import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form, Input } from 'antd'

import Signup from '@/components/signup'

jest.mock('@/config/email', () => ({
  TOKEN: ''
}))

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async (route: string) => mockPush(route)
  })
}))

const mockPasswordItem = (props: any) => (
  <Form.Item name={props.name} label={props.label}>
    <Input role="PasswordItem" />
  </Form.Item>
)
jest.mock('@/components/assets/input', () => ({
  PasswordItem: (props: any) => mockPasswordItem(props)
}))

jest.mock('@/context/notification/actions', () => ({
  ErrorNotification: jest.fn,
  FormError: (props: any) => <div>{props.error?.render ?? null}</div>
}))

jest.mock('@/components/loading', () => () => <div />)

const mockAPIError = jest.fn()
jest.mock('@/api/error', () => ({
  APIError: jest.fn().mockImplementation((apiError) => apiError)
}))

const mockAdd = jest.fn().mockImplementation(() => ({ alreadyExists: false }))
jest.mock('@/api/user', () => ({
  useUser: () => [
    undefined,
    {
      loadingUser: false,
      errorUser: ''
    }
  ],
  add: async () => mockAdd()
}))

jest.mock('@/api/system', () => ({
  useSystem: () => [
    { allowsignup: true },
    { loadingSystem: false, errorSystem: '' }
  ]
}))

describe('components/signup', () => {
  beforeEach(() => {
    mockPush.mockReset()

    mockAPIError.mockReset()
    mockAPIError.mockImplementation((apiError) => apiError)
  })

  test('onSignup', async () => {
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

    // Normal
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockPush).toHaveBeenLastCalledWith('/login'))

    unmount()
  })
})
