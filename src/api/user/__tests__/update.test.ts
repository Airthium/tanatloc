import { update } from '../update'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/user/update', () => {
  test('call', async () => {
    await update([])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
