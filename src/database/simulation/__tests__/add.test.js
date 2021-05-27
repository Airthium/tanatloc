import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('database/simulation/add', () => {
  test('call', async () => {
    const res = await add({ name: 'name', scheme: {} })
    expect(res).toEqual({
      id: 'id',
      name: 'name',
      scheme: {}
    })
  })
})
