import { add } from '../add'

jest.mock('../..', () => ({
  query: async () => ({ rows: [{ id: 'id' }] })
}))

describe('database/group/add', () => {
  test('call', async () => {
    const res = await add({ id: 'id' }, { name: 'name', users: ['id'] })
    expect(res).toEqual({
      id: 'id',
      name: 'name',
      users: ['id'],
      organization: 'id'
    })
  })
})
