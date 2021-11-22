import { log } from '../log'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/simulation/log', () => {
  test('call', async () => {
    await log({ id: 'id' }, '')
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
