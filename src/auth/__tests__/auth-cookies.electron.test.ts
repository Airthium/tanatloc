import { Request, Response } from 'express'

import * as auth from '../auth-cookies'

jest.mock('cookie', () => ({
  serialize: () => 'cookie',
  parse: (cookie: string): object => {
    if (cookie) return JSON.parse(cookie)
    return {}
  }
}))

jest.mock('is-electron', () => () => true)

let mockSet: string
let mockDelete: string
const mockGet = jest.fn()
jest.mock('electron-store', () =>
  jest.fn().mockImplementation(() => ({
    set: (_: string, value: string) => (mockSet = value),

    get: () => mockGet(),
    delete: (name: string) => {
      mockDelete = name
    }
  }))
)

describe('auth/auth-cookies', () => {
  const req = {} as Request
  const res = {} as Response

  test('setTokenCookie', () => {
    auth.setTokenCookie(res, 'token')
    expect(mockSet).toBe('cookie')
  })

  test('removeTokenCookie', () => {
    auth.removeTokenCookie(res)
    expect(mockDelete).toBe('auth-token')
  })

  test('parseCookies', () => {
    let cookie

    cookie = auth.parseCookies(req)
    expect(cookie).toEqual({})

    mockGet.mockImplementation(() =>
      JSON.stringify({
        token: 'cookie'
      })
    )
    cookie = auth.parseCookies(req)
    expect(cookie).toEqual({ token: 'cookie' })
  })
})
