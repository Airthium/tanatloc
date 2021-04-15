import useUser from '../useUser'

const mockError = jest.fn()
jest.mock('swr', () => () => ({
  data: { user: {} },
  error: mockError(),
  mutate: jest.fn()
}))

describe('api/user', () => {
  it('useUser', () => {
    const [user, { mutateUser, errorUser, loadingUser }] = useUser()
    expect(user).toEqual({})
    expect(mutateUser).toBeDefined()
    expect(errorUser).toBe()
    expect(loadingUser).toBe(false)
  })

  it('401', () => {
    // 401 error
    mockError.mockImplementation(() => ({
      status: 401
    }))
    const [user, { mutateUser, errorUser, loadingUser }] = useUser()
    expect(user).toEqual({})
    expect(mutateUser).toBeDefined()
    expect(errorUser).toBe()
    expect(loadingUser).toBe(false)
  })
})
