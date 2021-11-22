import { add } from '../add'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/user/add', () => {
  test('call', async () => {
    await add({ email: 'email', password: 'password' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
