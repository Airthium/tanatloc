import get from '../get'

jest.mock('../..', () => ({
  getter: async () => ({
    rows: [{ type: 'type' }]
  })
}))

describe('database/link/get', () => {
  test('call', async () => {
    const res = await get('id', ['type'])
    expect(res).toEqual({ id: 'id', type: 'type' })
  })
})
