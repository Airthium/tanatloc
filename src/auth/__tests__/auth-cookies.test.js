import * as auth from '../auth-cookies'

jest.mock('cookie', () => ({
  serialize: () => 'cookie',
  parse: (cookie) => cookie
}))

jest.mock('is-electron', () => () => false)

jest.mock('electron-store', () => {})

describe('auth/auth-cookies', () => {
  test('setTokenCookie', () => {
    let header
    const res = {
      setHeader: (type, value) => {
        header = value
      }
    }
    auth.setTokenCookie(res, 'token')
    expect(header).toBe('cookie')
  })

  test('removeTokenCookie', () => {
    let header
    const res = {
      setHeader: (type, value) => {
        header = value
      }
    }
    auth.removeTokenCookie(res)
    expect(header).toBe('cookie')
  })

  test('parseCookies', () => {
    let res

    // Empty
    const req = {}
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
    const req = {
      cookies: { token: 'cookie' }
    }
    const res = auth.getTokenCookie(req)
    expect(res).toBe('cookie')
  })
})
