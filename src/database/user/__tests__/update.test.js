import update from '../update'

const mockUpdater = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdater()
}))

describe('src/database/user/update', () => {
  it('call', async () => {
    await update({ user: {}, data: [{}] })
    expect(mockUpdater).toHaveBeenCalledTimes(1)
  })
})
