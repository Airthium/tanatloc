import get from '../get'

jest.mock('../..', () => ({
  getter: async () => ({
    rows: [{ email: 'username' }]
  })
}))

describe('database/user/get', () => {
  it('call', async () => {
    const res = await get('id')
    expect(res).toEqual({ id: 'id', email: 'username' })
  })
})
