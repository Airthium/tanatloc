import check from '../check'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/user/check', () => {
  test('call', async () => {
    await check({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
