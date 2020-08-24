import del from '../del'

jest.mock('../../call', () => ({
  call: async () => 'res'
}))

describe('src/api/workspace/delete', () => {
  it('delete', async () => {
    const res = await del({})
    expect(res).toBe('res')
  })
})
