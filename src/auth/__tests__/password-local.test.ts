import { localStrategy } from '../password-local'

jest.mock('passport-local', () => ({
  Strategy: class MockStrategy {
    constructor(_: {}, func: Function) {
      func('email', 'password', () => {
        // Empty
      })
      func('email', 'password', () => {
        // Empty
      })
      func('email', 'password', () => {
        // Empty
      })
      func(undefined, undefined, () => {
        // Empty
      })
    }
  }
}))

jest.mock('@/database/user', () => {
  let count = 0
  return {
    getByUsernameAndPassword: async ({ email }: { email?: string }) => {
      count++
      if (!email) throw new Error()
      if (count === 1) return
      if (count === 2) return { id: 'id', isvalidated: true }
      else return { id: 'id' }
    }
  }
})

describe('auth/password-local', () => {
  test('localStrategy', () => {
    expect(localStrategy).toBeDefined()
  })
})
