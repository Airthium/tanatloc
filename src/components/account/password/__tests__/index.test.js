import React from 'react'
import { render, screen } from '@testing-library/react'

import Password from '..'

jest.mock('@/components/assets/input', () => {
  const PasswordItem = () => <div />
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
    mockError.mockReset()

    mockUpdate.mockReset()
    mockCheck.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Password user={user} />)

    unmount()
  })

  // test('password mismatch', async () => {
  //   // Match
  //   await wrapper
  //     .find({ name: 'passwordConfirm' })
  //     .props()
  //     .rules[1]({ getFieldValue: () => 'password' })
  //     .validator({}, 'password')

  //   // Mismatch
  //   try {
  //     await wrapper
  //       .find({ name: 'passwordConfirm' })
  //       .props()
  //       .rules[1]({ getFieldValue: () => 'password' })
  //       .validator({}, 'other_password')
  //     expect(true).toBe(false)
  //   } catch (err) {
  //     expect(true).toBe(true)
  //   }
  // })

  // test('onFinish', async () => {
  //   mockCheck.mockImplementation(() => ({
  //     valid: true
  //   }))

  //   // Normal
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
  //     newPassword: 'password',
  //     passwordConfirm: 'password'
  //   })
  //   expect(mockCheck).toHaveBeenCalledTimes(1)
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // No check
  //   mockCheck.mockImplementation(() => ({
  //     valid: false
  //   }))
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
  //     newPassword: 'password',
  //     passwordConfirm: 'password'
  //   })
  //   expect(mockCheck).toHaveBeenCalledTimes(2)
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mockError).toHaveBeenCalledTimes(0)

  //   // Error
  //   mockCheck.mockImplementation(() => ({
  //     valid: true
  //   }))
  //   mockUpdate.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
  //     newPassword: 'password',
  //     passwordConfirm: 'password'
  //   })
  //   expect(mockCheck).toHaveBeenCalledTimes(3)
  //   expect(mockUpdate).toHaveBeenCalledTimes(2)
  //   expect(mockError).toHaveBeenCalledTimes(1)
  // })
})
