import process from '../process'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/link/process', () => {
  test('call', async () => {
    await process('id', {})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
