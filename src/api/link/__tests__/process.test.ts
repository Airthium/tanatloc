import { process } from '../process'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/link/process', () => {
  test('call', async () => {
    await process('id', { email: 'email', password: 'password' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
