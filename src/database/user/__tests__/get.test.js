import get from '../get'

jest.mock('../..', () => ({
  getter: async () => ({
    rows: [{ email: 'email' }]
  })
}))

describe('database/user/get', () => {
  test('call', async () => {
    const res = await get('id')
    expect(res).toEqual({ id: 'id', email: 'email' })
  })
})
