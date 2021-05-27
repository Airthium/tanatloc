import getAll from '../getAll'

jest.mock('../..', () => async () => ({ rows: [{ id: 'id' }] }))

describe('database/group/getAll', () => {
  test('call', async () => {
    const res = await getAll(['id'])
    expect(res).toEqual([{ id: 'id' }])
  })
})
