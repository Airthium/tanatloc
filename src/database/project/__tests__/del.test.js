import del from '../del'

const mockDelete = jest.fn()
jest.mock('../..', () => ({
  deleter: async () => mockDelete()
}))

describe('src/database/project/delete', () => {
  it('call', async () => {
    const res = await del({})
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })
})
