import getPart from '../getPart'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/geometry/getPart', () => {
  test('call', async () => {
    await getPart({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
