import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Users from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockList = jest.fn()
jest.mock('@/api/plugins', () => ({
  completeList: async () => mockList()
}))

jest.mock('../add', () => () => <div />)

jest.mock('../edit', () => () => <div />)

jest.mock('../delete', () => () => <div />)

describe('components/administration/users', () => {
  const users = [
    { id: 'id1', authorizedplugins: ['key'], superuser: true },
    { id: 'id2' }
  ]
  const swr = {
    addOneUser: jest.fn(),
    delOneUser: jest.fn(),
    mutateOneUser: jest.fn()
  }

  beforeEach(() => {
    mockError.mockReset()

    mockList.mockReset()
    mockList.mockImplementation(() => [
      {
        key: 'key',
        name: 'name',
        category: 'category'
      }
    ])
  })

  test('render', async () => {
    const { unmount } = render(<Users users={users} swr={swr} />)

    await waitFor(() => screen.getByRole('table'))

    unmount()
  })

  test('plugins error', async () => {
    mockList.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(<Users users={users} swr={swr} />)

    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('empty plugins', async () => {
    mockList.mockImplementation(() => {
      // Empty mock
    })
    const { unmount } = render(<Users users={users} swr={swr} />)

    await waitFor(() => screen.getByRole('table'))

    unmount()
  })

  test('sorters', async () => {
    const { unmount } = render(<Users users={users} swr={swr} />)

    await waitFor(() => screen.getByRole('table'))

    const sorter1 = screen.getByText('First name')
    fireEvent.click(sorter1)

    const sorter2 = screen.getByText('Last name')
    fireEvent.click(sorter2)

    const sorter3 = screen.getByText('Email')
    fireEvent.click(sorter3)

    unmount()
  })
})
