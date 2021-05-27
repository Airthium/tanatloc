import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Administration from '..'

const mockReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    query: mockQuery()
  })
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('../users', () => {
  const Users = () => <div />
  return Users
})
jest.mock('../groups', () => {
  const Groups = () => <div />
  return Groups
})
jest.mock('../registration', () => {
  const Registration = () => <div />
  return Registration
})

const mockUsers = jest.fn()
const mockAddOneUser = jest.fn()
const mockMutateOneUser = jest.fn()
const mockdDelOneUser = jest.fn()
const mockErrorUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUsers: () => [
    mockUsers(),
    {
      addOneUser: mockAddOneUser,
      mutateOneUser: mockMutateOneUser,
      delOneUser: mockdDelOneUser,
      errorUsers: mockErrorUser()
    }
  ]
}))

describe('components/administration', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({ tab: 'tab' }))

    mockError.mockReset()

    mockUsers.mockReset()
    mockAddOneUser.mockReset()
    mockMutateOneUser.mockReset()
    mockdDelOneUser.mockReset()
    mockErrorUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Administration />)

    unmount()
  })

  // test('onChange', () => {
  //   wrapper.find('Tabs').props().onChange()
  //   expect(mockReplace).toHaveBeenCalledTimes(1)
  // })

  // test('without query', () => {
  //   wrapper.unmount()
  //   mockQuery.mockImplementation(() => ({}))
  //   wrapper = shallow(<Administration />)
  // })

  // // test('effect', () => {
  // //   wrapper.unmount()
  // //   wrapper = mount(<Administration />)
  // //   expect(wrapper).toBeDefined()

  // //   // With error
  // //   wrapper.unmount()
  // //   mockErrorUser.mockImplementation(() => ({ message: 'Error' }))
  // //   wrapper = mount(<Administration />)
  // //   expect(mockError).toHaveBeenCalledTimes(1)
  // // })
})
