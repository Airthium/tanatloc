import { copy } from '../copy'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/simulation/copy', () => {
  test('call', async () => {
    await copy({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
