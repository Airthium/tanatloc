import { add } from '../add'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/workspace/add', () => {
  test('add', async () => {
    await add({ name: 'name' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
