import { useUsers } from '../useUsers'

const mockUsers = jest.fn()
jest.mock('swr', () => () => ({
  data: { users: mockUsers() },
  mutate: jest.fn()
}))

describe('api/users', () => {
  test('with users', () => {
    mockUsers.mockImplementation(() => [{ id: 'id' }])
    const [users, { addOneUser, mutateOneUser, delOneUser, loadingUsers }] =
      useUsers()
    expect(users).toEqual([{ id: 'id' }])
    expect(addOneUser).toBeDefined()
    addOneUser({})
    expect(mutateOneUser).toBeDefined()
    mutateOneUser({})
    mutateOneUser({ id: 'id' })
    expect(delOneUser).toBeDefined()
    delOneUser({})
    delOneUser({ id: 'id' })
    expect(loadingUsers).toBe(false)
  })

  test('without users', () => {
    mockUsers.mockImplementation(() => {})
    const [users] = useUsers()
    expect(users).toEqual([])
  })
})