import * as auth from '../auth-cookies'

jest.mock('cookie', () => ({
  serialize: () => 'cookie',
  parse: (cookie) => cookie
}))

jest.mock('is-electron', () => () => false)

jest.mock('electron-store', () => {})

describe('src/auth/auth-cookies', () => {
  it('setTokenCookie', () => {
    let header
    const res = {
      setHeader: (type, value) => {
        header = value
      }
    }
    auth.setTokenCookie(res, 'token')
    expect(header).toBe('cookie')
  })

  it('removeTokenCookie', () => {
    let header
    const res = {
      setHeader: (type, value) => {
        header = value
      }
    }
    auth.removeTokenCookie(res)
    expect(header).toBe('cookie')
  })

  it('parseCookies', () => {
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

  it('getTokenCookie', () => {
    const req = {
      cookies: { token: 'cookie' }
    }
    const res = auth.getTokenCookie(req)
    expect(res).toBe('cookie')
  })
})
