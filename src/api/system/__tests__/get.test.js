import get from '../get'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('/src/api/system/get', () => {
  it('call', async () => {
    mockCall.mockImplementation(() => [{ item: 'item' }])
    const items = await get([])
    expect(mockCall).toHaveBeenCalledTimes(1)
    expect(items).toEqual([{ item: 'item' }])
  })
})
