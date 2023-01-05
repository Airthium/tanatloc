import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { Form, Input } from 'antd'

import Password, { errors } from '..'

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => ({
  PasswordItem: (props: any) => mockPasswordItem(props)
}))

const mockSuccessNotification = jest.fn()
const mockFormError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  SuccessNotification: () => mockSuccessNotification(),
  FormError: () => mockFormError()
}))

const mockAPIError = jest.fn()
jest.mock('@/api/error', () => ({
  APIError: jest.fn().mockImplementation((apiError) => mockAPIError(apiError))
}))

const mockUpdate = jest.fn()
const mockCheck = jest.fn()
jest.mock('@/api/user', () => ({
  update: (update: any) => mockUpdate(update),
  check: (check: any) => mockCheck(check)
}))

describe('components/account/password', () => {
  const user = { email: 'email' }

  beforeEach(() => {
    mockPasswordItem.mockReset()
    mockPasswordItem.mockImplementation((props) => (
      <Form.Item label={props.label} name={props.name}>
        <Input />
      </Form.Item>
    ))

    mockSuccessNotification.mockReset()
    mockFormError.mockReset()
    mockFormError.mockImplementation(() => <div />)

    mockAPIError.mockReset()

    mockUpdate.mockReset()
    mockCheck.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Password user={user} />)

    unmount()
  })

  test('password mismatch', async () => {
    const { unmount } = render(<Password user={user} />)

    const mockWarn = jest.fn()
    console.warn = mockWarn()

    const currentPassword = screen.getByLabelText('Current password')
    const newPassword = screen.getByLabelText('New password')
    const passwordConfirmation = screen.getByLabelText('Password confirmation')
    const button = screen.getByRole('button')

    // Mismatch
    await act(() =>
      fireEvent.change(currentPassword, { target: { value: 'password' } })
    )
    await act(() =>
      fireEvent.change(newPassword, { target: { value: 'password' } })
    )
    await act(() =>
      fireEvent.change(passwordConfirmation, {
        target: { value: 'otherpassword' }
      })
    )
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockWarn).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onFinish', async () => {
    const { unmount } = render(<Password user={user} />)

    // Fill
    const currentPassword = screen.getByLabelText('Current password')
    const newPassword = screen.getByLabelText('New password')
    const passwordConfirmation = screen.getByLabelText('Password confirmation')
    await act(() =>
      fireEvent.change(currentPassword, { target: { value: 'password' } })
    )
    await act(() =>
      fireEvent.change(newPassword, { target: { value: 'password' } })
    )
    await act(() =>
      fireEvent.change(passwordConfirmation, { target: { value: 'password' } })
    )

    // Button
    const button = screen.getByRole('button')

    // Check error
    mockCheck.mockImplementation(() => {
      throw new Error('check error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockCheck).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockCheck).toHaveBeenLastCalledWith({
        email: 'email',
        password: 'password'
      })
    )
    await waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockAPIError).toHaveBeenLastCalledWith({
        title: errors.check,
        err: new Error('check error')
      })
    )

    // Wrong password
    mockCheck.mockImplementation(() => ({
      valid: false
    }))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockCheck).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockCheck).toHaveBeenLastCalledWith({
        email: 'email',
        password: 'password'
      })
    )
    await waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockAPIError).toHaveBeenLastCalledWith({ title: errors.invalid })
    )

    // Valid
    mockCheck.mockImplementation(() => ({
      valid: true
    }))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockCheck).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(mockCheck).toHaveBeenLastCalledWith({
        email: 'email',
        password: 'password'
      })
    )
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenLastCalledWith([
        {
          type: 'crypt',
          key: 'password',
          value: 'password'
        }
      ])
    )
    await waitFor(() =>
      expect(mockSuccessNotification).toHaveBeenCalledTimes(1)
    )

    // Update error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockCheck).toHaveBeenCalledTimes(4))
    await waitFor(() =>
      expect(mockCheck).toHaveBeenLastCalledWith({
        email: 'email',
        password: 'password'
      })
    )
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenLastCalledWith([
        {
          type: 'crypt',
          key: 'password',
          value: 'password'
        }
      ])
    )
    await waitFor(() => expect(mockAPIError).toHaveBeenCalledTimes(3))
    await waitFor(() =>
      expect(mockAPIError).toHaveBeenLastCalledWith({
        title: errors.update,
        err: new Error('update error')
      })
    )

    unmount()
  })
})
