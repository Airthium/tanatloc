import { del } from '../del'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/userModel/del', () => {
  test('call', async () => {
    await del({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
