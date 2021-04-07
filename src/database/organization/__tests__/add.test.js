import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('database/organization/add', () => {
  it('call', async () => {
    const res = await add({}, { name: 'name', users: ['id'] })
    expect(res).toEqual({
      id: 'id'
    })
  })
})
