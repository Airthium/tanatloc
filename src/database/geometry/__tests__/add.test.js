import add from '../add'

jest.mock('../..', () => async () => {
  return { rows: [{ id: 'id' }] }
})

describe('database/goemetry/add', () => {
  test('call', async () => {
    const res = await add({ id: 'id' }, { name: 'name.step', uid: 'test' })
    expect(res).toEqual({
      id: 'id',
      name: 'name.step',
      originalfilename: 'name.step',
      extension: 'step',
      uploadfilename: 'test.step'
    })
  })
})
