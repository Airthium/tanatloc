import update from '../update'

const mockUpdater = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdater()
}))

describe('database/group/update', () => {
  test('call', async () => {
    await update({}, [{}])
    expect(mockUpdater).toHaveBeenCalledTimes(1)
  })
})
