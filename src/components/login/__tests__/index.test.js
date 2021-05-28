import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Login from '@/components/login'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

jest.mock('@/components/loading', () => {
  const Loading = () => <div />
  return Loading
})

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockLogin = jest.fn()
jest.mock('@/api/login', () => async () => mockLogin())

const mockUser = jest.fn()
const mockUserLoading = jest.fn()
const mockErrorUser = jest.fn()
jest.mock('@/api/user/useUser', () => () => [
  mockUser(),
  {
    mutateUser: () => {},
    errorUser: mockErrorUser(),
    loadingUser: mockUserLoading()
  }
])

describe('components/login', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()

    mockError.mockReset()

    mockLogin.mockReset()

    mockUser.mockReset()
    mockUserLoading.mockReset()
    mockUserLoading.mockImplementation(() => false)
    mockErrorUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Login />)

    unmount()
  })

  // test('loading', () => {
  //   wrapper.unmount()

  //   mockUserLoading.mockImplementation(() => true)
  //   wrapper = shallow(<Login />)
  //   expect(wrapper.find('Loading').length).toBe(1)
  // })

  // // test('user effect', () => {
  // //   let mWrapper = mount(<Login />)
  // //   expect(mockPrefetch).toHaveBeenCalledTimes(2)
  // //   expect(mockPush).toHaveBeenCalledTimes(0)
  // //   mWrapper.unmount()

  // //   // With user & error
  // //   mockUser.mockImplementation(() => ({ user: { id: 'id' } }))
  // //   mockErrorUser.mockImplementation(() => ({ message: 'Error' }))
  // //   mWrapper = mount(<Login />)
  // //   expect(mockPrefetch).toHaveBeenCalledTimes(4)
  // //   expect(mockPush).toHaveBeenCalledTimes(1)
  // //   expect(mockError).toHaveBeenCalledTimes(1)
  // //   mWrapper.unmount()
  // // })

  // test('onLogin', async () => {
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
  //   expect(mockPush).toHaveBeenCalledTimes(0)

  //   mockLogin.mockImplementation(() => ({ ok: true }))
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
  //   expect(mockPush).toHaveBeenCalledTimes(1)

  //   mockLogin.mockImplementation(() => ({ ok: false }))
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
  //   expect(mockPush).toHaveBeenCalledTimes(1)

  //   mockLogin.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   await wrapper.find('ForwardRef(InternalForm)').props().onFinish({})
  //   expect(mockPush).toHaveBeenCalledTimes(1)
  // })

  // test('signup', () => {
  //   wrapper.find({ type: 'link' }).at(0).props().onClick()
  //   expect(mockPush).toHaveBeenCalledTimes(1)
  // })
})
