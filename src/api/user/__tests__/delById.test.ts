import { delById } from '../delById'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/user/delById', () => {
  test('call', async () => {
    await delById('id')
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
