import { useUser } from '../useUser'

const mockError = jest.fn()
jest.mock('swr', () => () => ({
  data: { user: {} },
  error: mockError(),
  mutate: jest.fn()
}))

describe('api/user', () => {
  test('useUser', () => {
    const [user, { mutateUser, clearUser, errorUser, loadingUser }] = useUser()
    expect(user).toEqual({})
    expect(mutateUser).toBeDefined()
    expect(clearUser).toBeDefined()
    expect(errorUser).toBe(undefined)
    expect(loadingUser).toBe(false)

    mutateUser({})
    clearUser()
  })

  test('401', () => {
    // 401 error
    mockError.mockImplementation(() => ({
      status: 401
    }))
    const [user, { mutateUser, errorUser, loadingUser }] = useUser()
    expect(user).toEqual({})
    expect(mutateUser).toBeDefined()
    expect(errorUser).toBe(undefined)
    expect(loadingUser).toBe(false)
  })
})