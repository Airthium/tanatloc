import { get } from '../get'

jest.mock('../..', () => ({
  getter: async () => ({
    rows: [{ title: 'title' }]
  })
}))

describe('database/project/get', () => {
  test('call', async () => {
    const res = await get('id', ['title'])
    expect(res).toEqual({ id: 'id', title: 'title' })
  })
})
