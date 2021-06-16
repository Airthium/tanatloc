import load from '../load'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/result/load', () => {
  test('call', async () => {
    await load({}, {})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
