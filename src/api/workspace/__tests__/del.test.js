import del from '../del'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('src/api/workspace/delete', () => {
  it('delete', async () => {
    await del({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
