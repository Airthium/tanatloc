import getByUsernameAndPassword from '../getByUsernameAndPassword'

jest.mock('../..', () => {
  return async () => ({
    rows: [{ id: 'id' }]
  })
})

describe('database/query/user/getByUsernameAndPassword', () => {
  test('call', async () => {
    const res = await getByUsernameAndPassword({})
    expect(res).toEqual({ id: 'id' })
  })
})
