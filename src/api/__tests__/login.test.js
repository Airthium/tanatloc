import login from '../login'

jest.mock('../call', () => {
  return async () => ({
    staus: 200,
    json: async () => 'res'
  })
})

describe('lib/api/user', () => {
  it('login', async () => {
    const res = await login({})
    // expect(res).toBe('res')
  })
})
