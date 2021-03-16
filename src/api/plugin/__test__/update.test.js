import update from '../update'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugin/update', () => {
  it('call', async () => {
    await update({}, [])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
