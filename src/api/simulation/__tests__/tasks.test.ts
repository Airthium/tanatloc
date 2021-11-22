import { tasks } from '../tasks'

const mockCall = jest.fn(async () => ({
  json: jest.fn
}))
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/simulation/tasks', () => {
  test('call', async () => {
    await tasks({ id: 'id' })
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
