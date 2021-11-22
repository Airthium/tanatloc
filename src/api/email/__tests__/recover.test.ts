import { recover } from '../recover'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/email/recover', () => {
  test('call', async () => {
    await recover('email')
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
