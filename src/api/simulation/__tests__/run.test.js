import run from '../run'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('src/api/simulation/run', () => {
  it('call', async () => {
    await run({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
