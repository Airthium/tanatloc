import download from '../download'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/result/download', () => {
  test('call', async () => {
    await download({}, {})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
