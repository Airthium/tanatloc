import add from '../add'

const mockQuery = jest.fn()
jest.mock('../..', () => async (query) => {
  return mockQuery(query)
})

describe('src/database/user/add', () => {
  it('call', async () => {
    let user

    // New
    mockQuery.mockImplementation((query) => {
      if (query.includes('SELECT')) return { rows: [] }
      else return { rows: [{ id: 'id' }] }
    })
    user = await add({ username: 'username', password: 'password' })
    expect(user).toEqual({
      username: 'username',
      id: 'id'
    })

    // Already existing
    mockQuery.mockImplementation(() => ({ rows: [{}] }))
    user = await add({ username: 'username', password: 'password' })
    expect(user).toEqual({
      alreadyExists: true
    })
  })
})
