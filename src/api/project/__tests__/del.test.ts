import { del } from '../del'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/project/del', () => {
  test('call', async () => {
    await del({ id: 'id' }, { id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
