import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import PasswordItem from '..'

const mockSystem = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [mockSystem()]
}))

describe('components/assets/input/password', () => {
  beforeEach(() => {
    mockSystem.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<PasswordItem />)

    unmount()
  })

  // test('with system password', async () => {
  //   mockSystem.mockImplementation(() => ({
  //     allowsignup: true,
  //     password: {
  //       min: 8,
  //       max: 16,
  //       requireLetter: true,
  //       requireNumber: true,
  //       requireSymbol: true
  //     }
  //   }))
  //   wrapper = shallow(<PasswordItem name="password" />)

  //   const validator = wrapper
  //     .find({ name: 'password' })
  //     .props()
  //     .rules[0]().validator

  //   try {
  //     await validator(null, '')
  //   } catch (err) {
  //     expect(err.message).toBe('Please enter a password')
  //   }

  //   try {
  //     await validator(null, 'small')
  //   } catch (err) {
  //     expect(err.message).toBe(
  //       'Your password is too small - Your password must contain a number - Your password must contain a symbol'
  //     )
  //   }

  //   try {
  //     await validator(null, 'longlonglonglonglonglong')
  //   } catch (err) {
  //     expect(err.message).toBe(
  //       'Your password is too long - Your password must contain a number - Your password must contain a symbol'
  //     )
  //   }

  //   try {
  //     await validator(null, '12345678')
  //   } catch (err) {
  //     expect(err.message).toBe(
  //       'Your password must contain a letter - Your password must contain a symbol'
  //     )
  //   }

  //   try {
  //     await validator(null, 'abcdefgh')
  //   } catch (err) {
  //     expect(err.message).toBe(
  //       'Your password must contain a number - Your password must contain a symbol'
  //     )
  //   }

  //   try {
  //     await validator(null, 'abcd1234')
  //   } catch (err) {
  //     expect(err.message).toBe('Your password must contain a symbol')
  //   }

  //   await validator(null, 'abcd1234&')
  // })

  // test('without system password', async () => {
  //   mockSystem.mockImplementation(() => ({
  //     allowsignup: true,
  //     password: {
  //       requireLetter: false,
  //       requireNumber: false,
  //       requireSymbol: false
  //     }
  //   }))
  //   wrapper = shallow(<PasswordItem edit={true} />)

  //   const validator = wrapper
  //     .find({ name: 'password' })
  //     .props()
  //     .rules[0]().validator

  //   await validator(null, '******')

  //   try {
  //     await validator(null, 'small')
  //   } catch (err) {
  //     expect(err.message).toBe('Your password is too small')
  //   }

  //   try {
  //     await validator(null, 'longlonglonglonglonglong')
  //   } catch (err) {
  //     expect(err.message).toBe('Your password is too long')
  //   }

  //   await validator(null, '12345678')

  //   await validator(null, 'abcdefgh')

  //   await validator(null, 'abcd1234')
  // })
})
