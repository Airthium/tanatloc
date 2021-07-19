import tasks from '../tasks'

const mockCall = jest.fn(async () => 'res')
jest.mock('../../call', () => ({
  call: () => mockCall()
}))

describe('api/simulation/tasks', () => {
  test('call', async () => {
    await tasks({})
    expect(mockCall).toHaveBeenCalledTimes(1)
  })
})
