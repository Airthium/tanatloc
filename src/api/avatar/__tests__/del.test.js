import del from '../del'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/avatar/del', () => {
  it('call', async () => {
    await del({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
