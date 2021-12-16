import { Request, Response } from 'express'

import login from '../login'

jest.mock('express', () => () => ({
  disable: jest.fn,
  use: jest.fn,
  post: (_: any, func: Function) => {
    const req = {} as Request
    req.body = { email: 'email' }
    const res = {} as Response
    res.status = () => res
    res.json = () => res

    func(req, res)
    func(req, res)
    func(req, res)
  }
}))

jest.mock('passport', () => {
  let count = 0
  return {
    initialize: jest.fn,
    use: jest.fn,
    authenticate: async (_, __, callback) => {
      count++
      if (count === 1) callback(undefined, { token: 'token' })
      else if (count === 2) callback()
      else if (count === 3) callback(new Error())
    }
  }
})

jest.mock('@/auth/password-local', () => ({
  localStrategy: {}
}))

jest.mock('@/auth/iron', () => ({
  encryptSession: jest.fn
}))

jest.mock('@/auth/auth-cookies', () => ({
  setTokenCookie: jest.fn
}))

jest.mock('@/lib/sentry', () => ({
  configureScope: (callback) => {
    callback({ setUser: jest.fn })
  },
  captureException: jest.fn
}))

describe('route/login', () => {
  test('login', () => {
    expect(login).toBeDefined()
  })
})
