import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form, Input } from 'antd'

import Password, { errors } from '..'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter()
}))

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => ({
  PasswordItem: (props: any) => mockPasswordItem(props)
}))

const mockErrorNotification = jest.fn()
const mockFormError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, description: string) =>
    mockErrorNotification(title, description),
  FormError: () => mockFormError()
}))

const mockAPIError = jest.fn()
jest.mock('@/api/error', () => ({
  APIError: jest.fn().mockImplementation((apiError) => mockAPIError(apiError))
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

    mockErrorNotification.mockReset()
    mockFormError.mockReset()
    mockFormError.mockImplementation(() => <div />)

    mockAPIError.mockReset()

    mockLinkGet.mockReset()
    mockLinkGet.mockImplementation(() => ({}))
    mockLinkProcess.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Password />)

    screen.getByText('Loading...')

    unmount()
  })

  test('render with id', async () => {
    mockRouter.mockImplementation(() => ({
      query: { id: 'id' }
    }))
    const { unmount } = render(<Password />)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.wrongLink,
        undefined
      )
    )

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
      throw new Error('get error')
    })
    const { unmount } = render(<Password />)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.internal,
        new Error('get error')
      )
    )

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

    // Fill
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

    // Incorrect
    await waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockAPIError).toHaveBeenLastCalledWith({ title: errors.incorrect })
    )

    // Error
    fireEvent.change(email, { target: { value: 'test@email.com' } })
    mockLinkProcess.mockImplementation(() => {
      throw new Error('process error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockAPIError).toHaveBeenLastCalledWith({
        title: errors.internal,
        err: new Error('process error')
      })
    )

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockLinkProcess).toHaveBeenCalledTimes(1))

    unmount()
  })
})
