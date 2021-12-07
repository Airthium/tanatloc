import { get } from '../get'

jest.mock('../..', () => ({
  query: async () => ({
    rows: [{ item: 'item' }]
  })
}))

describe('database/system/get', () => {
  test('call', async () => {
    const res = await get(['item'])
    expect(res).toEqual({ item: 'item' })
  })
})