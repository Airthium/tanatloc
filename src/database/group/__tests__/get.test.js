import get from '../get'

jest.mock('../..', () => ({
  getter: async () => ({
    rows: [{ id: 'id' }]
  })
}))

describe('database/group/get', () => {
  it('call', async () => {
    const res = await get('id')
    expect(res).toEqual({ id: 'id' })
  })
})
