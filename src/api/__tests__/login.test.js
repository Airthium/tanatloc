import login from '../login'

jest.mock('is-electron', () => () => false)

describe('src/api/user', () => {
  it('login', async () => {
    global.fetch = async () => {
      return {
        status: 200,
        json: () => 'res'
      }
    }

    const res = await login({})
    expect(res).toBe('res')
  })

  it('login failed', async () => {
    global.fetch = async () => {
      return {
        status: 401
      }
    }

    const res = await login({})
    expect(res).toBe(undefined)
  })
})
