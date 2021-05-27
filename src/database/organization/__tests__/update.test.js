import update from '../update'

const mockUpdater = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdater()
}))

describe('database/organization/update', () => {
  test('call', async () => {
    await update({}, [{}])
    expect(mockUpdater).toHaveBeenCalledTimes(1)
  })
})
