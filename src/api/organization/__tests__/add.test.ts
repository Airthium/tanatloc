import { add } from '../add'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/organization/add', () => {
  test('call', async () => {
    await add({ name: 'name' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
