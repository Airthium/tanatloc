import stop from '../stop'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/simulation/stop', () => {
  it('call', async () => {
    await stop({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
