import check from '../check'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/user/check', () => {
  it('call', async () => {
    await check({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
