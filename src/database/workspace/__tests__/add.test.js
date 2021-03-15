import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('database/workspace/add', () => {
  it('add', async () => {
    const res = await add({}, { name: 'name' })
    expect(res).toEqual({ id: 'id', name: 'name' })
  })
})
