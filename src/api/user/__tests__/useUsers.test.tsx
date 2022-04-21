import { render } from '@testing-library/react'

import { useUsers } from '../useUsers'

const mockUsers = jest.fn()
jest.mock('swr', () => () => ({
  data: { users: mockUsers() },
  mutate: jest.fn()
}))

let data: any
const FunctionalComponent = () => {
  const [users, { addOneUser, mutateOneUser, delOneUser, loadingUsers }] =
    useUsers()

  data = {
    users,
    swr: { addOneUser, mutateOneUser, delOneUser, loadingUsers }
  }

  return null
}

describe('api/users', () => {
  test('with users', () => {
    mockUsers.mockImplementation(() => [{ id: 'id' }])

    render(<FunctionalComponent />)

    expect(data.users).toEqual([{ id: 'id' }])
    expect(data.swr.addOneUser).toBeDefined()
    data.swr.addOneUser({})
    expect(data.swr.mutateOneUser).toBeDefined()
    data.swr.mutateOneUser({})
    data.swr.mutateOneUser({ id: 'id' })
    expect(data.swr.delOneUser).toBeDefined()
    data.swr.delOneUser({})
    data.swr.delOneUser({ id: 'id' })
    expect(data.swr.loadingUsers).toBe(false)
  })

  test('without users', () => {
    mockUsers.mockImplementation(() => {
      // Empty
    })

    render(<FunctionalComponent />)

    expect(data.users).toEqual([])
  })
})
