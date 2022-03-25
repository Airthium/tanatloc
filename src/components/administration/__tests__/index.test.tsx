import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Administration, { errors } from '..'

const mockReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    replace: () => mockReplace(),
    query: mockQuery()
  })
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('../users', () => () => <div />)
jest.mock('../registration', () => () => <div />)
jest.mock('../plugins', () => () => <div />)

const mockUsers = jest.fn()
const mockAddOneUser = jest.fn()
const mockMutateOneUser = jest.fn()
const mockdDelOneUser = jest.fn()
const mockErrorNotificationUser = jest.fn()
jest.mock('@/api/user', () => ({
  useUsers: () => [
    mockUsers(),
    {
      addOneUser: mockAddOneUser,
      mutateOneUser: mockMutateOneUser,
      delOneUser: mockdDelOneUser,
      errorUsers: mockErrorNotificationUser()
    }
  ]
}))

describe('components/administration', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({ tab: 'tab' }))

    mockErrorNotification.mockReset()

    mockUsers.mockReset()
    mockAddOneUser.mockReset()
    mockMutateOneUser.mockReset()
    mockdDelOneUser.mockReset()
    mockErrorNotificationUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Administration />)

    unmount()
  })

  test('onChange', () => {
    const { unmount } = render(<Administration />)
    // Registration
    const registration = screen.getByRole('tab', { name: 'Registration' })
    fireEvent.click(registration)
    expect(mockReplace).toHaveBeenCalledTimes(1)

    // Users
    const users = screen.getByRole('tab', { name: 'Users' })
    fireEvent.click(users)
    expect(mockReplace).toHaveBeenCalledTimes(2)

    unmount()
  })

  test('without query', () => {
    mockQuery.mockImplementation(() => ({}))
    const { unmount } = render(<Administration />)

    unmount()
  })

  test('error', () => {
    mockErrorNotificationUser.mockImplementation(() => true)
    const { unmount } = render(<Administration />)
    expect(mockErrorNotification).toHaveBeenCalledTimes(1)
    expect(mockErrorNotification).toHaveBeenLastCalledWith(errors.users, true)

    unmount()
  })
})
