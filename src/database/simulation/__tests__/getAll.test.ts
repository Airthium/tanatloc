import { getAll } from '../getAll'

jest.mock('../..', () => ({
  query: async () => ({ rows: [{ id: 'id', name: 'name' }] })
}))

describe('database/simulation/get', () => {
  test('call', async () => {
    const res = await getAll(['name'])
    expect(res).toEqual([{ id: 'id', name: 'name' }])
  })
})
