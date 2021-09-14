import { localStrategy } from '../password-local'

jest.mock('passport-local', () => ({
  Strategy: class MockStrategy {
    constructor(_, func) {
      func('email', 'password', () => {})
      func('email', 'password', () => {})
      func('email', 'password', () => {})
      func(undefined, undefined, () => {})
    }
  }
}))

jest.mock('@/database/user', () => {
  let count = 0
  return {
    getByUsernameAndPassword: async ({ email, password }) => {
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
