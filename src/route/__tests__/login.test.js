import login from '../login'

jest.mock('express', () => () => ({
  disable: () => {},
  use: () => {},
  post: (route, func) => {
    const req = {}
    const res = {
      status: () => ({
        send: () => {}
      })
    }
    func(req, res)
    func(req, res)
    func(req, res)
  }
}))

const mockPassport = jest.fn()
jest.mock('passport', () => {
  let count = 0
  return {
    initialize: () => {},
    use: () => {},
    authenticate: async (method, data, callback) => {
      count++
      if (count === 1) callback(undefined, { token: 'token' })
      else if (count === 2) callback()
      else if (count === 3) callback(new Error())
    }
  }
})

jest.mock('../../auth/password-local', () => ({
  localStrategy: {}
}))

jest.mock('../../auth/iron', () => ({
  encryptSession: () => {}
}))

jest.mock('../../auth/auth-cookies', () => ({
  setTokenCookie: () => {}
}))

jest.mock('../../lib/sentry', () => ({
  configureScope: (callback) => {
    callback({ setUser: () => {} })
  },
  captureException: () => {}
}))

describe('src/route/login', () => {
  it('login', () => {
    expect(login).toBeDefined()
  })
})
