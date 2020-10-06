import del from '../del'

const mockDelete = jest.fn()
jest.mock('../..', () => ({
  deleter: async () => mockDelete()
}))

describe('src/database/quary/workspace/delete', () => {
  it('delete', async () => {
    await del({})
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })
})
