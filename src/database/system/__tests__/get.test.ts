import { get } from '../get'

jest.mock('../..', () => ({
  query: async () => ({
    rows: [{ item: 'item' }]
  })
}))

describe('database/security/get', () => {
  test('call', async () => {
    const res = await get(['allowsignup'])
    expect(res).toEqual({ item: 'item' })
  })
})
