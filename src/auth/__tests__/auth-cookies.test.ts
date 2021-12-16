import { Request, Response } from 'express'

import * as auth from '../auth-cookies'

jest.mock('cookie', () => ({
  serialize: () => 'cookie',
  parse: (cookie: string): object => {
    if (cookie) return JSON.parse(cookie)
    return {}
  }
}))

jest.mock('is-electron', () => () => false)

jest.mock('electron-store', () => {
  // Empty
})

describe('auth/auth-cookies', () => {
  const req = {} as Request
  let header: string
  let resStatus: number
  let resJson: string | object
  const res = {} as Response
  res.setHeader = (_: string, value: string) => {
    header = value
    return res
  }
  res.status = (status: number) => {
    resStatus = status
    return res
  }
  res.end = () => {
    resJson = 'end'
    return res
  }
  res.json = (value: object) => {
    resJson = value
    return res
  }

  test('setTokenCookie', () => {
    auth.setTokenCookie(res, 'token')
    expect(header).toBe('cookie')
  })

  test('removeTokenCookie', () => {
    auth.removeTokenCookie(res)
    expect(header).toBe('cookie')
  })

  test('parseCookies', () => {
    let cookie

    // Empty
    cookie = auth.parseCookies({
      ...req,
      cookies: {}
    } as Request)
    expect(cookie).toEqual({})

    // Cookies
    cookie = auth.parseCookies({
      ...req,
      cookies: { token: 'cookie' }
    } as Request)
    expect(cookie).toEqual({ token: 'cookie' })

    // Header empty cookies
    cookie = auth.parseCookies({
      ...req,
      headers: {}
    } as Request)
    expect(cookie).toEqual({})

    // Header cookies
    cookie = auth.parseCookies({
      ...req,
      headers: { cookie: JSON.stringify({ token: 'cookie' }) }
    } as Request)
    expect(cookie).toEqual({ token: 'cookie' })
  })

  test('getTokenCookie', () => {
    const res = auth.getTokenCookie({
      ...req,
      headers: { cookie: JSON.stringify({ token: 'cookie' }) }
    } as Request)
    expect(res).toBe('cookie')
  })
})
