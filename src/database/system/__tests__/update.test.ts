import { update } from '../update'

const mockUpdater = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdater()
}))

describe('database/system/update', () => {
  test('call', async () => {
    await update([{ key: 'key', value: 'value' }])
    expect(mockUpdater).toHaveBeenCalledTimes(1)
  })
})
