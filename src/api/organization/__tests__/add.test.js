import add from '../add'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/organization/add', () => {
  it('call', async () => {
    await add({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
