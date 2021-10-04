import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('database/workspace/add', () => {
  test('add', async () => {
    const res = await add({ id: 'id' }, { name: 'name' })
    expect(res).toEqual({ id: 'id', name: 'name', owners: ['id'] })
  })
})
