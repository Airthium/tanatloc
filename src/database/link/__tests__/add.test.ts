import { add } from '../add'

jest.mock('../..', () => ({
  query: async () => ({ rows: [{ id: 'id' }] })
}))

describe('database/link/add', () => {
  test('call', async () => {
    const res = await add({ type: 'type', email: 'email' })
    expect(res).toEqual({
      id: 'id',
      type: 'type',
      email: 'email'
    })
  })
})
