import add from '../add'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/workspace/add', () => {
  it('add', async () => {
    await add({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
