import { get } from '../get'

jest.mock('../..', () => ({
  getter: async () => ({
    rows: [{ name: 'name' }]
  })
}))

describe('database/avatar/get', () => {
  test('call', async () => {
    const res = await get('id', {})
    expect(res).toEqual({ id: 'id', name: 'name' })
  })
})
