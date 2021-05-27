import add from '../add'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugin/add', () => {
  test('call', async () => {
    await add({}, [])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
