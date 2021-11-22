import { add } from '../add'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/avatar/add', () => {
  test('call', async () => {
    await add({ name: 'name', uid: 'uid', data: Buffer.from('buffer') })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
