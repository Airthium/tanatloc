import getById from '../getById'

jest.mock('../..', () => {
  return async () => ({
    rows: [{ email: 'username' }]
  })
})

describe('database/query/user', () => {
  it('getById', async () => {
    const res = await getById('id')
    expect(res).toEqual({ id: 'id', username: 'username' })
  })
})
