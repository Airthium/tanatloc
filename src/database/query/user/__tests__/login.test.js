import login from '../login'

let mockReturn = () => [{}]
jest.mock('../../..', () => {
  return async () => ({
    rows: mockReturn()
  })
})

jest.mock('../../../../../config/db', () => {
  return {
    databases: {}
  }
})

describe('database/query/user', () => {
  it('login', async () => {
    const res = await login({ username: 'username', password: 'password' })
    expect(res).toEqual({ username: 'username' })
  })

  it('login failed', async () => {
    mockReturn = () => []
    const res = await login({ username: 'username', password: 'password' })
    expect(res).toEqual(null)
  })
})
