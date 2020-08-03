import getByUsername from '../getByUsername'

jest.mock('../../..', () => {
  return async () => ({
    rows: [{ id: 'id' }]
  })
})

jest.mock('../../../../../config/db', () => {
  return {
    databases: {}
  }
})

describe('database/query/user', () => {
  it('getByUsername', async () => {
    const res = await getByUsername('username')
    expect(res).toEqual({ id: 'id', username: 'username' })
  })
})
