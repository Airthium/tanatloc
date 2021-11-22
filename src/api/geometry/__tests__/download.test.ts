import { download } from '../download'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/geometry/download', () => {
  test('call', async () => {
    await download({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
