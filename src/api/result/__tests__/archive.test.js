import archive from '../archive'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/result/archive', () => {
  test('call', async () => {
    await archive({}, {})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
