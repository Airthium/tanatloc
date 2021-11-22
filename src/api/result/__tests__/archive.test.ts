import { archive } from '../archive'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/result/archive', () => {
  test('call', async () => {
    await archive({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
