import add from '../add'

jest.mock('../../call', () => ({
  call: async () => 'res'
}))

describe('src/api/workspace/add', () => {
  it('add', async () => {
    const res = await add({})
    expect(res).toBe('res')
  })
})
