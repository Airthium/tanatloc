import update from '../update'

const mockUpdater = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdater()
}))

describe('src/database/group/update', () => {
  it('call', async () => {
    await update({}, [{}])
    expect(mockUpdater).toHaveBeenCalledTimes(1)
  })
})
