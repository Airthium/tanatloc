import { accept } from '../accept'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/organization/accept', () => {
  test('call', async () => {
    await accept({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
