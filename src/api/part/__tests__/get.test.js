import get from '../get'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('src/api/part/get', () => {
  it('call', async () => {
    await get({}, {})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
