import { login } from '../login'

jest.mock('is-electron', () => () => false)

Object.defineProperty(global, 'fetch', {
  value: async () => {
    return {
      status: 401
    }
  },
  configurable: true
})

describe('api/user', () => {
  test('login failed', async () => {
    const res = await login({ email: 'email', password: 'password' })
    expect(res).toEqual({ ok: false })
  })
})
