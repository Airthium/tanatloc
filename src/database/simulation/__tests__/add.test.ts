import { add } from '../add'

jest.mock('../..', () => ({
  query: async () => ({
    rows: [{ id: 'id' }]
  })
}))

describe('database/simulation/add', () => {
  test('call', async () => {
    const res = await add({ name: 'name', scheme: {}, project: 'id' })
    expect(res).toEqual({
      id: 'id',
      name: 'name',
      scheme: {},
      project: 'id'
    })
  })
})
