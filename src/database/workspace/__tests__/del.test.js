import del from '../del'

const mockDelete = jest.fn()
jest.mock('../..', () => ({
  deleter: async () => mockDelete()
}))

describe('database/quary/workspace/delete', () => {
  test('delete', async () => {
    await del({})
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })
})
