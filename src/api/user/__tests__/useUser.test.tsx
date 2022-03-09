import { render } from '@testing-library/react'

import { useUser } from '../useUser'

const mockError = jest.fn()
jest.mock('swr', () => () => ({
  data: { user: {} },
  error: mockError(),
  mutate: jest.fn()
}))

let data: any
const FunctionalComponent = () => {
  const [user, { mutateUser, clearUser, errorUser, loadingUser }] = useUser()

  data = {
    user,
    swr: { mutateUser, clearUser, errorUser, loadingUser }
  }

  return null
}

describe('api/user', () => {
  test('useUser', () => {
    render(<FunctionalComponent />)

    expect(data.user).toEqual({})
    expect(data.swr.mutateUser).toBeDefined()
    expect(data.swr.clearUser).toBeDefined()
    expect(data.swr.errorUser).toBe(undefined)
    expect(data.swr.loadingUser).toBe(false)

    data.swr.mutateUser({})
    data.swr.clearUser()
  })

  test('401', () => {
    // 401 error
    mockError.mockImplementation(() => ({
      status: 401
    }))

    render(<FunctionalComponent />)

    expect(data.user).toEqual({})
    expect(data.swr.mutateUser).toBeDefined()
    expect(data.swr.errorUser).toBe(undefined)
    expect(data.swr.loadingUser).toBe(false)
  })
})
