import update from '../update'

const mockUpdate = jest.fn()
jest.mock('../..', () => ({
  updater: async () => mockUpdate()
}))

describe('src/database/project/update', () => {
  it('call', async () => {
    const res = await update({ project: {}, data: [{}] })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
