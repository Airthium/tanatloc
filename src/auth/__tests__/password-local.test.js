import { localStrategy } from '../password-local'

jest.mock('passport-local', () => ({
  Strategy: class MockStrategy {
    constructor(func) {
      func('username', 'password', () => {})
      func(undefined, undefined, () => {})
    }
  }
}))

jest.mock('../../database/user', () => ({
  getByUsernameAndPassword: async ({ username, password }) => {
    if (!username) throw new Error()
  }
}))

describe('src/auth/password-local', () => {
  it('localStrategy', () => {
    expect(localStrategy).toBeDefined()
  })
})
