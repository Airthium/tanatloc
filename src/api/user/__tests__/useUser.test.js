import useUser from '../useUser'

jest.mock('swr', () => () => ({ data: { user: {} }, mutate: jest.fn() }))

describe('src/api/user', () => {
  it('useUser', () => {
    const [user, { mutateUser, loadingUser }] = useUser()
    expect(user).toEqual({})
    expect(mutateUser).toBeDefined()
    expect(loadingUser).toBe(false)
  })
})
