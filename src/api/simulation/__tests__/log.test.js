import log from '../log'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/simulation/log', () => {
  test('call', async () => {
    await log({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
