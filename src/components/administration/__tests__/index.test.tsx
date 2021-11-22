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

jest.mock('../users', () => () => <div />)
jest.mock('../registration', () => () => <div />)

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

  test('onChange', () => {
    const { unmount } = render(<Administration />)
    // Users
    const users = screen.getByRole('tab', { name: 'Users' })
    fireEvent.click(users)
    expect(mockReplace).toHaveBeenCalledTimes(1)
    // Registration
    const registration = screen.getByRole('tab', { name: 'Registration' })
    fireEvent.click(registration)
    expect(mockReplace).toHaveBeenCalledTimes(2)

    unmount()
  })

  test('without query', () => {
    mockQuery.mockImplementation(() => ({}))
    const { unmount } = render(<Administration />)

    unmount()
  })

  test('error', () => {
    mockErrorUser.mockImplementation(() => true)
    const { unmount } = render(<Administration />)
    expect(mockError).toHaveBeenCalledTimes(1)

    unmount()
  })
})
