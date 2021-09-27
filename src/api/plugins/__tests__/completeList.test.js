import completeList from '../completeList'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugins/list', () => {
  test('call', async () => {
    await completeList()
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
