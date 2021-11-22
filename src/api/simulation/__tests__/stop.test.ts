import { stop } from '../stop'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/simulation/stop', () => {
  test('call', async () => {
    await stop({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
