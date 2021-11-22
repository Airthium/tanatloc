import { getPart } from '../getPart'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/geometry/getPart', () => {
  test('call', async () => {
    await getPart({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
