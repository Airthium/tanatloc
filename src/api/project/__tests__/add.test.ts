import { add } from '../add'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/project/add', () => {
  test('call', async () => {
    await add({ id: 'id' }, { title: 'title', description: '' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
