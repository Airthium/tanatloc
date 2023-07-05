import { extra } from '../extra'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/plugin/extra', () => {
  test('call', async () => {
    await extra({}, 'action')
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
