import update from '../update'

const mockUpdate = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdate()
}))

describe('src/database/workspace/update', () => {
  it('update', async () => {
    await update({}, [{ key: 'test', value: 'test' }])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
