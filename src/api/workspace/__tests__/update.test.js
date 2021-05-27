import update from '../update'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/workspace/update', () => {
  test('update', async () => {
    await update({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
