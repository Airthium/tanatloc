import run from '../run'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/simulation/run', () => {
  test('call', async () => {
    await run({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
