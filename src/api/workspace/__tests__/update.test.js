import update from '../update'

jest.mock('../../call', () => ({
  call: async () => 'res'
}))

describe('src/api/workspace/update', () => {
  it('update', async () => {
    const res = await update({})
    expect(res).toBe('res')
  })
})
