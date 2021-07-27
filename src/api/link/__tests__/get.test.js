import get from '../get'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/link/get', () => {
  test('call', async () => {
    await get('id', [])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
