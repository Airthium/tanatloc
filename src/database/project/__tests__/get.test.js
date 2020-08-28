import get from '../get'

jest.mock('../..', () => ({
  getter: async () => ({
    rows: [{ title: 'title' }]
  })
}))

describe('database/project/get', () => {
  it('call', async () => {
    const res = await get('id')
    expect(res).toEqual({ id: 'id', title: 'title' })
  })
})
