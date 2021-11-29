import { archive } from '../archive'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/project/add', () => {
  test('call', async () => {
    await archive({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
