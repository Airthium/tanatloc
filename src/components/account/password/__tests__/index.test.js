import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { notification } from 'antd'

import Password from '..'

const mockPasswordItem = jest.fn()
jest.mock('@/components/assets/input', () => {
  const PasswordItem = (props) => mockPasswordItem(props)
  return { PasswordItem }
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
const mockCheck = jest.fn()
jest.mock('@/api/user', () => ({
  update: () => mockUpdate(),
  check: () => mockCheck()
}))

describe('components/account/information', () => {
  const user = { email: 'email' }

  beforeEach(() => {
    mockPasswordItem.mockReset()
    mockPasswordItem.mockImplementation((props) => (
      <div>
        <label htmlFor={'passwordForm_' + props.label} title={props.label}>
          {props.label}
        </label>
        <input id={'passwordForm_' + props.label} />
      </div>
    ))

    mockError.mockReset()

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
    fireEvent.change(currentPassword, { target: { value: 'password' } })
    fireEvent.change(newPassword, { target: { value: 'password' } })
    fireEvent.change(passwordConfirmation, {
      target: { value: 'otherpassword' }
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockWarn).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onFinish', async () => {
    const { unmount } = render(<Password user={user} />)

    const button = screen.getByRole('button')

    // Error
    mockCheck.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Wrong password
    mockCheck.mockImplementation(() => ({
      valid: false
    }))
    const mockErrorNotification = jest.fn()
    jest
      .spyOn(notification, 'error')
      .mockImplementation(() => mockErrorNotification())
    fireEvent.click(button)
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))

    // Valid
    mockCheck.mockImplementation(() => ({
      valid: true
    }))
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))

    unmount()
  })
})
