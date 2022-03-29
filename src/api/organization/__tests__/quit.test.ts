import { quit } from '../quit'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/organization/quit', () => {
  test('call', async () => {
    await quit({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
