import recover from '../recover'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/email/recover', () => {
  test('call', async () => {
    await recover()
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
