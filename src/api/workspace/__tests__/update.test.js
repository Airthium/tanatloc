import update from '../update'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('src/api/workspace/update', () => {
  it('update', async () => {
    await update({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
