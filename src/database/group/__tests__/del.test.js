import del from '../del'

const mockDelete = jest.fn()
jest.mock('../..', () => ({
  deleter: async () => mockDelete()
}))

describe('src/database/group/delete', () => {
  it('call', async () => {
    await del({})
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })
})
