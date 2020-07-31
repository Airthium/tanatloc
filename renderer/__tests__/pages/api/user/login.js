import login from '../../../../pages/api/user/login'

jest.mock('../../../../../src/lib/user', () => ({
  login: async () => ({
    id: 'id'
  })
}))

describe('pages/api/user/login', () => {
  it('login', async () => {
    let result
    const res = {
      setHeader: jest.fn(),
      send: (content) => (result = content)
    }
    await login({ body: { username: 'username', password: 'password' } }, res)
    expect(result).toEqual({ id: 'id' })
  })
})
