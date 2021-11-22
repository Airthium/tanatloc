import { check } from '../check'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/user/check', () => {
  test('call', async () => {
    await check({ email: 'email', password: 'password' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
