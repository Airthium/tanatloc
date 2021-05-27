import login from '../login'

jest.mock('is-electron', () => () => false)

describe('api/user', () => {
  test('login', async () => {
    global.fetch = async () => {
      return {
        status: 200,
        json: () => 'res'
      }
    }

    const res = await login({})
    expect(res).toBe('res')
  })

  test('login failed', async () => {
    global.fetch = async () => {
      return {
        status: 401
      }
    }

    const res = await login({})
    expect(res).toEqual({ status: 401 })
  })
})
