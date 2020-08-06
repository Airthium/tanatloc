import login from '../../../pages/api/login'

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

jest.mock('../../../../src/auth/password-local', () => ({
  localStrategy: {}
}))

jest.mock('../../../../src/auth/iron', () => ({
  encryptSession: () => {}
}))

jest.mock('../../../../src/auth/auth-cookies', () => ({
  setTokenCookie: () => {}
}))

describe('pages/api/login', () => {
  it('login', () => {
    expect(login).toBeDefined()
  })
})
