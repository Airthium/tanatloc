import login from '../login'

let mockCall = () => ({
  status: 200,
  json: async () => 'res'
})
jest.mock('../call', () => {
  return async () => {
    return mockCall()
  }
})

describe('src/api/user', () => {
  it('login', async () => {
    const res = await login({})
    expect(res).toBe('res')
  })

  it('login failed', async () => {
    mockCall = () => ({
      status: 404
    })
    const res = await login({})
    expect(res).toBe(null)
  })
})
