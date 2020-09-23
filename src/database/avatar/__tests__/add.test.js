import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('src/database/avatar/add', () => {
  it('call', async () => {
    const res = await add({}, { name: 'name', path: 'path' })
    expect(res).toEqual({
      id: 'id'
    })
  })
})
