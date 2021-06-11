import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Users from '..'

jest.mock('../add', () => () => <div />)

jest.mock('../edit', () => () => <div />)

jest.mock('../delete', () => () => <div />)

jest.mock('@/plugins', () => ({
  key: {
    name: 'name',
    category: 'category'
  }
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

  test('render', () => {
    const { unmount } = render(<Users users={users} swr={swr} />)

    unmount()
  })

  test('sorters', () => {
    const { unmount } = render(<Users users={users} swr={swr} />)

    const sorter1 = screen.getByText('First name')
    fireEvent.click(sorter1)

    const sorter2 = screen.getByText('Last name')
    fireEvent.click(sorter2)

    const sorter3 = screen.getByText('Email')
    fireEvent.click(sorter3)

    unmount()
  })
})
