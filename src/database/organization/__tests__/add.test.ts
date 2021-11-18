import { add } from '../add'

jest.mock('../..', () => ({
  query: async () => ({ rows: [{ id: 'id' }] })
}))

describe('database/organization/add', () => {
  test('call', async () => {
    const res = await add({ name: 'name', owners: ['id'] })
    expect(res).toEqual({
      id: 'id',
      name: 'name',
      owners: ['id']
    })
  })
})
