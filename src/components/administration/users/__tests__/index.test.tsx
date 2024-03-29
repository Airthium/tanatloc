import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Users, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
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
    {
      id: 'id1',
      email: 'email1',
      authorizedplugins: ['key1', 'key2'],
      superuser: true
    },
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
        key: 'key1',
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
      throw new Error('plugins error')
    })
    const { unmount } = render(<Users users={users} swr={swr} />)

    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.plugins,
        new Error('plugins error')
      )
    )

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
    await act(() => fireEvent.click(sorter1))

    const sorter2 = screen.getByText('Last name')
    await act(() => fireEvent.click(sorter2))

    const sorter3 = screen.getByText('Email')
    await act(() => fireEvent.click(sorter3))

    unmount()
  })

  test('onResize', async () => {
    Object.defineProperty(Element.prototype, 'clientHeight', {
      value: '1000'
    })

    const { unmount } = render(<Users users={users} swr={swr} />)

    await waitFor(() => screen.getByText('email1'))

    unmount()
  })
})
