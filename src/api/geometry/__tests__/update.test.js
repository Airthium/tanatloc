import update from '../update'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/geometry/update', () => {
  test('call', async () => {
    await update({}, [])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
