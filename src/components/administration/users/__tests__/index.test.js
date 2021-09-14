import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Users from '..'

jest.mock('../add', () => () => <div />)

jest.mock('../edit', () => () => <div />)

jest.mock('../delete', () => () => <div />)

jest.mock('@/api/plugins', () => ({
  list: async () => [
    {
      key: 'key',
      name: 'name',
      category: 'category'
    }
  ]
}))

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

  test('render', async () => {
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
