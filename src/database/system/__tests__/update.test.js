import update from '../update'

const mockUpdater = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdater()
}))

describe('database/system/update', () => {
  it('call', async () => {
    await update(['item'])
    expect(mockUpdater).toHaveBeenCalledTimes(1)
  })
})
