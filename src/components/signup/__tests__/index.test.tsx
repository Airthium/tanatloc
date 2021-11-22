import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form, Input } from 'antd'

import Signup from '@/components/signup'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => ({
  PasswordItem: (props) => mockPasswordItem(props)
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/loading', () => () => <div />)

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
  add: async () => mockAdd()
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
    mockPrefetch.mockReset()
    mockPush.mockReset()

    mockPasswordItem.mockReset()
    mockPasswordItem.mockImplementation(() => <div />)

    mockError.mockReset()

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
    expect(mockError).toHaveBeenCalledTimes(2)

    unmount()
  })

  test('onSignup', async () => {
    mockPasswordItem.mockImplementation((props) => (
      <Form.Item name={props.name} label={props.label}>
        <Input role="PasswordItem" />
      </Form.Item>
    ))
    const { unmount } = render(<Signup />)

    const button = screen.getByRole('button')

    // Fill email & password
    const email = screen.getByLabelText('Enter your email address')
    const password = screen.getByRole('PasswordItem')
    const confirm = screen.getByLabelText('Confirm your password')

    fireEvent.change(email, { target: { value: 'email@email.email' } })
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.change(confirm, { target: { value: 'password' } })

    // Already exists
    mockAdd.mockImplementation(() => ({ alreadyExists: true }))
    fireEvent.click(button)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))

    const login = screen.getByRole('button', { name: 'Log in ?' })
    fireEvent.click(login)
    expect(mockPush).toHaveBeenCalledTimes(1)

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Normal
    mockAdd.mockImplementation(() => ({ alreadyExists: false }))
    fireEvent.click(button)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(2))

    unmount()
  })

  test('mismatch passwords rule', async () => {
    mockPasswordItem.mockImplementation((props) => (
      <Form.Item name={props.name} label={props.label}>
        <Input role="PasswordItem" />
      </Form.Item>
    ))
    const { unmount } = render(<Signup />)

    const mockWarn = jest.fn()
    console.warn = mockWarn

    const password = screen.getByRole('PasswordItem')
    const confirm = screen.getByLabelText('Confirm your password')

    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.change(confirm, { target: { value: 'other_password' } })

    await waitFor(() => expect(mockWarn).toHaveBeenCalledTimes(1))

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
