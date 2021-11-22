import { add } from '../add'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/group/add', () => {
  test('call', async () => {
    await add({ id: 'id' }, { name: 'name', users: ['id'] })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
