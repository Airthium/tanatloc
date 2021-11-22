import { run } from '../run'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/simulation/run', () => {
  test('call', async () => {
    await run({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
