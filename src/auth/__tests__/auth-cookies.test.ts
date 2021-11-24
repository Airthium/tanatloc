import { IRequest, IResponse } from '@/route/index.d'

import * as auth from '../auth-cookies'

const mockParse = jest.fn()
jest.mock('cookie', () => ({
  serialize: () => 'cookie',
  parse: (cookie: string): string => mockParse(cookie)
}))

jest.mock('is-electron', () => () => false)

jest.mock('electron-store', () => {
  // Empty
})

describe('auth/auth-cookies', () => {
  beforeEach(() => {
    mockParse.mockReset()
    mockParse.mockImplementation((cookie) => cookie)
  })

  test('setTokenCookie', () => {
    let header: string
    const res: IResponse = {
      setHeader: (_: string, value: string) => (header = value),
      status: (_: number) => res,
      end: () => res,
      json: () => res
    }
    auth.setTokenCookie(res, 'token')
    expect(header).toBe('cookie')
  })

  test('removeTokenCookie', () => {
    let header: string
    const res: IResponse = {
      setHeader: (_: string, value: string) => (header = value),
      status: (_: number) => res,
      end: () => res,
      json: () => res
    }
    auth.removeTokenCookie(res)
    expect(header).toBe('cookie')
  })

  test('parseCookies', () => {
    let res: string

    // Empty
    const req: IRequest = {}
    res = auth.parseCookies(req)
    expect(res).toBe('')

    // Cookies
    req.cookies = 'cookies'
    res = auth.parseCookies(req)
    expect(res).toBe('cookies')

    // Header cookies
    req.cookies = undefined
    req.headers = {
      cookie: 'cookie'
    }
    res = auth.parseCookies(req)
    expect(res).toEqual('cookie')
  })

  test('getTokenCookie', () => {
    mockParse.mockImplementation((cookie) => JSON.parse(cookie))

    const req: IRequest = {
      headers: {
        cookie: JSON.stringify({ token: 'cookie' })
      }
    }
    const res = auth.getTokenCookie(req)
    expect(res).toBe('cookie')
  })
})
