import { update } from '../update'

const mockUpdate = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdate()
}))

describe('database/project/update', () => {
  test('call', async () => {
    await update({ id: 'id' }, [{ key: 'key', value: 'value' }])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
