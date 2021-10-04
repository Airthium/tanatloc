import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('database/project/add', () => {
  test('call', async () => {
    const res = await add(
      { id: 'id' },
      { id: 'id' },
      { title: 'title', description: 'description' }
    )
    expect(res).toEqual({
      id: 'id',
      title: 'title',
      description: 'description',
      owners: ['id'],
      workspace: 'id'
    })
  })

  test('without description', async () => {
    const res = await add({ id: 'id' }, { id: 'id' }, { title: 'title' })
    expect(res).toEqual({
      id: 'id',
      title: 'title',
      description: '',
      owners: ['id'],
      workspace: 'id'
    })
  })
})
