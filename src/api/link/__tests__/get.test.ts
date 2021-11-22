import { get } from '../get'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/link/get', () => {
  test('call', async () => {
    await get('id', [])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
