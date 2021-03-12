import { localStrategy } from '../password-local'

jest.mock('passport-local', () => ({
  Strategy: class MockStrategy {
    constructor(param, func) {
      func('email', 'password', () => {})
      func(undefined, undefined, () => {})
    }
  }
}))

jest.mock('@/database/user', () => ({
  getByUsernameAndPassword: async ({ email, password }) => {
    if (!email) throw new Error()
  }
}))

describe('src/auth/password-local', () => {
  it('localStrategy', () => {
    expect(localStrategy).toBeDefined()
  })
})
