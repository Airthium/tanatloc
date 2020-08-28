import getByUsernameAndPassword from '../getByUsernameAndPassword'

jest.mock('../..', () => {
  return async () => ({
    rows: [{ id: 'id' }]
  })
})

describe('database/query/user/getByUsernameAndPassword', () => {
  it('call', async () => {
    const res = await getByUsernameAndPassword('username')
    expect(res).toEqual({ id: 'id' })
  })
})
