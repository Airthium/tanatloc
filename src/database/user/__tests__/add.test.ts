import { add } from '../add'

const mockQuery = jest.fn()
jest.mock('../..', () => ({
  query: async (query: string) => mockQuery(query)
}))

describe('database/user/add', () => {
  beforeEach(() => {
    mockQuery.mockReset()
  })

  test('call', async () => {
    let user

    // New
    mockQuery.mockImplementation((query) => {
      if (query.includes('SELECT')) return { rows: [] }
      else return { rows: [{ id: 'id' }] }
    })
    user = await add({ email: 'email', password: 'password' })
    expect(user).toEqual({
      id: 'id',
      email: 'email'
    })

    // Already existing
    mockQuery.mockImplementation(() => ({ rows: [{}] }))
    user = await add({ email: 'email', password: 'password' })
    expect(user).toEqual({
      alreadyExists: true
    })
  })
})
