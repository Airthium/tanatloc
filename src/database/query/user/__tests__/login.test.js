import login from '../login'

jest.mock('../../..', () => {
  return async () => ({
    rows: [{}]
  })
})

jest.mock('../../../../../config/db', () => {
  return {
    databases: {}
  }
})

describe('database/query/user', () => {
  it('login', async () => {
    const res = await login({})
    expect(res).toEqual([{}])
  })
})
