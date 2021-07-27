import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('database/link/add', () => {
  test('call', async () => {
    const res = await add({ type: 'type', email: 'email' })
    expect(res).toEqual({
      id: 'id'
    })
  })
})
