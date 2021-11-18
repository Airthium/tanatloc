import { add } from '../add'

jest.mock('../..', () => ({
  query: async () => ({ rows: [{ id: 'id' }] })
}))

describe('database/avatar/add', () => {
  test('call', async () => {
    const res = await add({ name: 'name', path: 'path' })
    expect(res).toEqual({
      id: 'id',
      name: 'name'
    })
  })
})
