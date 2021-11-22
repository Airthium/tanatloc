import { add } from '../add'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/geometry/add', () => {
  test('call', async () => {
    await add(
      { id: 'id' },
      { name: 'name', uid: 'uid', buffer: Buffer.from('buffer') }
    )
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
