import { IResponse } from '@/route/index.d'

import * as auth from '../auth-cookies'

jest.mock('cookie', () => ({
  serialize: () => 'cookie',
  parse: (cookie) => cookie
}))

jest.mock('is-electron', () => () => true)

let mockSet: string
let mockDelete: string
const mockGet = jest.fn()
jest.mock(
  'electron-store',
  () =>
    class MockStore {
      constructor() {
        //@ts-ignore
        this.set = (_: string, value: string) => (mockSet = value)
        //@ts-ignore
        this.get = () => mockGet()
        //@ts-ignore
        this.delete = (name: string) => {
          mockDelete = name
        }
      }
    }
)

describe('auth/auth-cookies', () => {
  test('setTokenCookie', () => {
    const res: IResponse = {
      setHeader: jest.fn,
      status: (_: number) => res,
      end: () => res,
      json: () => res
    }
    auth.setTokenCookie(res, 'token')
    expect(mockSet).toBe('cookie')
  })

  test('removeTokenCookie', () => {
    const res: IResponse = {
      setHeader: jest.fn,
      status: (_: number) => res,
      end: () => res,
      json: () => res
    }
    auth.removeTokenCookie(res)
    expect(mockDelete).toBe('auth-token')
  })

  test('parseCookies', () => {
    let res: string
    const req = {}

    res = auth.parseCookies(req)
    expect(res).toBe('')

    mockGet.mockImplementation(() => 'cookie')
    res = auth.parseCookies(req)
    expect(res).toBe('cookie')
  })
})
