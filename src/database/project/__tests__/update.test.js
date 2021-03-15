import update from '../update'

const mockUpdate = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdate()
}))

describe('database/project/update', () => {
  it('call', async () => {
    await update({}, [{}])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
