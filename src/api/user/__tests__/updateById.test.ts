import { updateById } from '../updateById'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/user/updateById', () => {
  test('call', async () => {
    await updateById('id', [])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
