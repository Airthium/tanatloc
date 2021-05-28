import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Signup from '@/components/signup'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

jest.mock('@/components/assets/input', () => ({
  PasswordItem: 'passwordItem'
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('@/components/loading', () => {
  const Loading = () => <div />
  return Loading
})

const mockLogin = jest.fn()
jest.mock('@/api/login', () => async () => mockLogin())

const mockUser = jest.fn()
const mockLoading = jest.fn()
const mockMutate = jest.fn()
const mockAdd = jest.fn()
const mockErrorUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUser: () => [
    mockUser(),
    {
      loadingUser: mockLoading(),
      mutateUser: mockMutate,
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

    mockError.mockReset()

    mockUser.mockReset()
    mockLoading.mockReset()
    mockMutate.mockReset()
    mockAdd.mockReset()
    mockErrorUser.mockReset()

    mockLogin.mockReset()

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

  // test('with user', () => {
  //   wrapper.unmount()
  //   mockUser.mockImplementation(() => ({}))
  //   mockLoading.mockImplementation(() => false)
  //   wrapper = shallow(<Signup />)
  // })

  // test('onSignup', async () => {
  //   // Error
  //   mockAdd.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
  //     email: 'email',
  //     password: 'password',
  //     passwordConfirmation: 'password'
  //   })

  //   // Already exists
  //   mockAdd.mockImplementation(() => ({
  //     alreadyExists: true
  //   }))
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
  //     email: 'email',
  //     password: 'password',
  //     passwordConfirmation: 'password'
  //   })

  //   // Normal
  //   mockAdd.mockImplementation(() => ({}))
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
  //     email: 'email',
  //     password: 'password',
  //     passwordConfirmation: 'password'
  //   })
  //   // expect(mockLogin).toHaveBeenCalledTimes(1)
  // })

  // test('mismatch passwords rule', async () => {
  //   // Match
  //   await wrapper
  //     .find({ name: 'passwordConfirmation' })
  //     .props()
  //     .rules[1]({ getFieldValue: () => 'password' })
  //     .validator({}, 'password')

  //   // Mismatch
  //   try {
  //     await wrapper
  //       .find({ name: 'passwordConfirmation' })
  //       .props()
  //       .rules[1]({ getFieldValue: () => 'password' })
  //       .validator({}, 'other_password')
  //     expect(true).toBe(false)
  //   } catch (err) {
  //     expect(true).toBe(true)
  //   }
  // })

  // test('login', async () => {
  //   mockAdd.mockImplementation(() => ({
  //     alreadyExists: true
  //   }))
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({
  //     email: 'email',
  //     password: 'password',
  //     passwordConfirmation: 'password'
  //   })

  //   wrapper.find('Alert').props().message.props.children[4].props.onClick()
  //   expect(mockPush).toHaveBeenCalledTimes(1)
  // })

  // // test('effect', () => {
  // //   wrapper.unmount()
  // //   mockSystem.mockImplementation(() => ({}))
  // //   wrapper = mount(<Signup />)
  // //   expect(mockPrefetch).toHaveBeenCalledTimes(2)
  // //   expect(mockPush).toHaveBeenCalledTimes(0)

  // //   // No signup, errors
  // //   wrapper.unmount()
  // //   mockSystem.mockImplementation(async () => ({
  // //     allowsignup: false
  // //   }))
  // //   mockErrorUser.mockImplementation(() => ({ message: 'Error' }))
  // //   mockErrorSystem.mockImplementation(() => ({ message: 'Error' }))
  // //   wrapper = mount(<Signup />)
  // //   expect(mockPrefetch).toHaveBeenCalledTimes(4)
  // //   expect(mockPush).toHaveBeenCalledTimes(0)
  // //   expect(mockError).toHaveBeenCalledTimes(2)

  // //   // Already user
  // //   wrapper.unmount()
  // //   mockUser.mockImplementation(() => ({}))
  // //   wrapper = mount(<Signup />)
  // //   expect(mockPrefetch).toHaveBeenCalledTimes(6)
  // //   expect(mockPush).toHaveBeenCalledTimes(1)
  // // })
})
