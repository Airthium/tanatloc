import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Users, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
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
    { id: 'id1', email: 'email1', authorizedplugins: ['key'], superuser: true },
    { id: 'id2', email: 'email2', authorizedplugins: [], superuser: false }
  ]
  const swr = {
    addOneUser: jest.fn(),
    delOneUser: jest.fn(),
    mutateOneUser: jest.fn()
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockList.mockReset()
    mockList.mockImplementation(() => [
      {
        key: 'key',
        name: 'name',
        category: 'category'
      }
    ])
  })

  test('render', () => {
    const { unmount } = render(<Users users={users} swr={swr} />)

    waitFor(() => screen.getByRole('table'))

    unmount()
  })

  test('plugins error', () => {
    mockList.mockImplementation(() => {
      throw new Error('plugins error')
    })
    const { unmount } = render(<Users users={users} swr={swr} />)

    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.plugins,
        new Error('plugins error')
      )
    )

    unmount()
  })

  test('empty plugins', () => {
    mockList.mockImplementation(() => {
      // Empty mock
    })
    const { unmount } = render(<Users users={users} swr={swr} />)

    waitFor(() => screen.getByRole('table'))

    unmount()
  })

  test('sorters', () => {
    const { unmount } = render(<Users users={users} swr={swr} />)

    waitFor(() => screen.getByRole('table'))

    const sorter1 = screen.getByText('First name')
    fireEvent.click(sorter1)

    const sorter2 = screen.getByText('Last name')
    fireEvent.click(sorter2)

    const sorter3 = screen.getByText('Email')
    fireEvent.click(sorter3)

    unmount()
  })

  test('onResize', () => {
    Object.defineProperty(Element.prototype, 'clientHeight', {
      value: '1000'
    })

    const { unmount } = render(<Users users={users} swr={swr} />)

    waitFor(() => screen.getByText('email1'))

    unmount()
  })
})
