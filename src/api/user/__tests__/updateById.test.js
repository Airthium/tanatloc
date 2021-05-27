import updateById from '../updateById'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/user/updateById', () => {
  test('call', async () => {
    await updateById('id', [])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
