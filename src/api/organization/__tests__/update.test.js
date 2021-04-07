import update from '../update'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/organization/update', () => {
  it('call', async () => {
    await update([])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
