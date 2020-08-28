import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('src/database/workspace/add', () => {
  it('add', async () => {
    const res = await add('id', { name: 'name' })
    expect(res).toEqual({ id: 'id', name: 'name' })
  })
})
