import { del } from '../del'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugin/del', () => {
  test('call', async () => {
    await del({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
