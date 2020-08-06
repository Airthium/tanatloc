import * as auth from '../auth-cookies'

jest.mock('cookie', () => ({
  serialize: () => 'cookie',
  parse: (cookie) => cookie
}))

jest.mock('is-electron', () => () => true)

let mockSet
let mockDelete
let mockGet = () => {}
jest.mock(
  'electron-store',
  () =>
    class MockStore {
      constructor() {
        this.set = (name, value) => (mockSet = value)
        this.get = () => mockGet()
        this.delete = (name) => {
          mockDelete = name
        }
      }
    }
)

describe('src/auth/auth-cookies', () => {
  it('setTokenCookie', () => {
    const res = {}
    auth.setTokenCookie(res, 'token')
    expect(mockSet).toBe('cookie')
  })

  it('removeTokenCookie', () => {
    const res = {}
    auth.removeTokenCookie(res)
    expect(mockDelete).toBe('auth-token')
  })

  it('parseCookies', () => {
    let res
    const req = {}

    res = auth.parseCookies(req)
    expect(res).toBe('')

    mockGet = () => 'cookie'
    res = auth.parseCookies(req)
    expect(res).toBe('cookie')
  })
})
