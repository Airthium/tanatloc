import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('src/database/project/add', () => {
  it('call', async () => {
    const res = await add({}, { title: 'title', description: 'description' })
    expect(res).toEqual({
      id: 'id',
      title: 'title',
      description: 'description'
    })
  })

  it('without description', async () => {
    const res = await add({}, { title: 'title', description: '' })
    expect(res).toEqual({
      id: 'id',
      title: 'title',
      description: ''
    })
  })
})
