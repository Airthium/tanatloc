import { add } from '../add'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugin/add', () => {
  test('call', async () => {
    await add({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
