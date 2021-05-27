import update from '../update'

const mockUpdate = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdate()
}))

describe('database/workspace/update', () => {
  test('update', async () => {
    await update({}, [{ key: 'test', value: 'test' }])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
