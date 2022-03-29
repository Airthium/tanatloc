import { decline } from '../decline'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/organization/decline', () => {
  test('call', async () => {
    await decline({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
