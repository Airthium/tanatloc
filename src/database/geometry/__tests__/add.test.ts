import { add } from '../add'

jest.mock('../..', () => ({
  query: async () => ({ rows: [{ id: 'id' }] })
}))

describe('database/goemetry/add', () => {
  test('call', async () => {
    const res = await add({ id: 'id' }, { name: 'name.step', uid: 'test' })
    expect(res).toEqual({
      id: 'id',
      name: 'name',
      originalfilename: 'name.step',
      extension: 'step',
      uploadfilename: 'test.step'
    })
  })
})
