import list from '../list'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugins/list', () => {
  test('call', async () => {
    await list()
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
