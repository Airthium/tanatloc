import { getAll } from '../getAll'

jest.mock('../..', () => ({
  query: async () => ({ rows: [{ id: 'id' }] })
}))

describe('database/organization/getAll', () => {
  test('call', async () => {
    const res = await getAll(['name'])
    expect(res).toEqual([{ id: 'id' }])
  })
})
