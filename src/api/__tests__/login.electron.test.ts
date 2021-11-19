import { login } from '../login'

jest.mock('is-electron', () => () => true)

describe('api/user', () => {
  test('login', async () => {
    Object.defineProperty(global, 'fetch', {
      value: async () => {
        return {
          status: 200,
          json: () => ({
            ok: true,
            id: 'id',
            isvalidated: false
          })
        }
      },
      configurable: true
    })

    const res = await login({ email: 'email', password: 'password' })
    expect(res).toEqual({ ok: true, id: 'id', isvalidated: false })
  })
})
