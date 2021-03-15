import delById from '../delById'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/user/delById', () => {
  it('call', async () => {
    await delById('id')
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
