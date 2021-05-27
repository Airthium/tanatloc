import add from '../add'

const mockQuery = jest.fn()
jest.mock('../..', () => async (query) => {
  return mockQuery(query)
})

describe('database/user/add', () => {
  test('call', async () => {
    let user

    // New
    mockQuery.mockImplementation((query) => {
      if (query.includes('SELECT')) return { rows: [] }
      else return { rows: [{ id: 'id' }] }
    })
    user = await add({ email: 'email', password: 'password' })
    expect(user).toEqual({
      id: 'id'
    })

    // Already existing
    mockQuery.mockImplementation(() => ({ rows: [{}] }))
    user = await add({ email: 'email', password: 'password' })
    expect(user).toEqual({
      alreadyExists: true
    })
  })
})
