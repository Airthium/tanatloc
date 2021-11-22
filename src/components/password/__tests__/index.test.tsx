import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form, Input } from 'antd'

import Password from '..'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter()
}))

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => ({
  PasswordItem: (props) => mockPasswordItem(props)
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: (title: string, description: string) => mockError(title, description)
}))

const mockLinkGet = jest.fn()
const mockLinkProcess = jest.fn()
jest.mock('@/api/link', () => ({
  get: async () => mockLinkGet(),
  process: async () => mockLinkProcess()
}))

describe('components/password', () => {
  beforeEach(() => {
    mockRouter.mockReset()
    mockRouter.mockImplementation(() => ({
      query: {}
    }))

    mockPasswordItem.mockReset()
    mockPasswordItem.mockImplementation(() => <div />)

    mockError.mockReset()

    mockLinkGet.mockReset()
    mockLinkGet.mockImplementation(() => ({}))
    mockLinkProcess.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Password />)

    unmount()
  })

  test('render with id', async () => {
    mockRouter.mockImplementation(() => ({
      query: { id: 'id' }
    }))
    const { unmount } = render(<Password />)

    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('correct type', async () => {
    mockRouter.mockImplementation(() => ({
      query: { id: 'id' }
    }))
    mockLinkGet.mockImplementation(() => ({
      type: 'passwordRecovery'
    }))
    mockPasswordItem.mockImplementation(() => <div role="PasswordItem" />)
    const { unmount } = render(<Password />)

    await waitFor(() => screen.getByRole('PasswordItem'))

    unmount()
  })

  test('api get error', async () => {
    mockRouter.mockImplementation(() => ({
      query: { id: 'id' }
    }))
    mockLinkGet.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(<Password />)

    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onFinish', async () => {
    mockRouter.mockImplementation(() => ({
      push: jest.fn(),
      query: { id: 'id' }
    }))
    mockLinkGet.mockImplementation(() => ({
      type: 'passwordRecovery',
      email: 'test@email.com'
    }))
    mockPasswordItem.mockImplementation((props) => (
      <Form.Item name={props.name} label={props.label}>
        <Input role="PasswordItem" />
      </Form.Item>
    ))
    const { unmount } = render(<Password />)

    await waitFor(() => screen.getByRole('PasswordItem'))

    const email = screen.getByLabelText('Enter your email address')
    const password = screen.getByRole('PasswordItem')
    const confirm = screen.getByLabelText('Confirm your password')

    const button = screen.getByRole('button')

    fireEvent.change(email, { target: { value: 'email@email.email' } })
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.change(confirm, { target: { value: 'other_password' } })
    fireEvent.click(button)

    fireEvent.change(confirm, { target: { value: 'password' } })
    fireEvent.click(button)

    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    fireEvent.change(email, { target: { value: 'test@email.com' } })
    fireEvent.click(button)
    await waitFor(() => expect(mockLinkProcess).toHaveBeenCalledTimes(1))

    mockLinkProcess.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)

    unmount()
  })
})
