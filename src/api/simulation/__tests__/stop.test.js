import stop from '../stop'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('src/api/simulation/stop', () => {
  it('call', async () => {
    await stop({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
