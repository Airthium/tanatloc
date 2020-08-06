import useUser from '../useUser'

jest.mock('swr', () => () => ({ data: { user: {} }, mutate: jest.fn() }))

describe('src/api/user', () => {
  it('useUser', () => {
    const [user, { mutate, loading }] = useUser()
    expect(user).toEqual({})
    expect(mutate).toBeDefined()
    expect(loading).toBe(false)
  })
})
