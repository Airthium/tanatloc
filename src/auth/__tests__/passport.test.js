import passport from '../passport'

jest.mock('passport', () => ({
  serializeUser: (callback) => callback({ username: 'username' }, jest.fn()),
  deserializeUser: (callback) => callback({}, 'username', jest.fn()),
  use: jest.fn()
}))

jest.mock('passport-local', () => {
  return class LocalSrategy {
    constructor(param, callback) {
      callback({}, 'username', 'password', jest.fn())
      callback({}, '', '', jest.fn())
    }
  }
})

jest.mock('../../database/query/user/login', () => {
  return async (user) => {
    if (user.username) return {}
    else return null
  }
})

jest.mock('../../database/query/user/getByUsername', () => async () => {})

describe('src/auth', () => {
  it('passport', () => {
    expect(passport.serializeUser).toBeDefined()
    expect(passport.deserializeUser).toBeDefined()
    expect(passport.use).toBeDefined()
  })
})
