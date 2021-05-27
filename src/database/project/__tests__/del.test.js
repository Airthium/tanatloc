import del from '../del'

const mockDelete = jest.fn()
jest.mock('../..', () => ({
  deleter: async () => mockDelete()
}))

describe('database/project/delete', () => {
  test('call', async () => {
    await del({})
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })
})
