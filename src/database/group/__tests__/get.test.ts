import { get } from '../get'

jest.mock('../..', () => ({
  getter: async () => ({
    rows: [{ id: 'id' }]
  })
}))

describe('database/group/get', () => {
  test('call', async () => {
    const res = await get('id', ['name'])
    expect(res).toEqual({ id: 'id' })
  })
})
