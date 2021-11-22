import { update } from '../update'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/workspace/update', () => {
  test('update', async () => {
    await update({ id: 'id' }, [])
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
