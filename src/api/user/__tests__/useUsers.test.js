import useUsers from '../useUsers'

jest.mock('swr', () => () => ({
  data: { users: [{ id: 'id' }] },
  mutate: jest.fn()
}))

describe('src/api/users', () => {
  it('useUsers', () => {
    const [
      users,
      { addOneUser, mutateOneUser, delOneUser, loadingUsers }
    ] = useUsers()
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
})
