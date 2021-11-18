import { add } from '../add'

const mockElectron = jest.fn()
jest.mock('is-electron', () => () => mockElectron())

const mockQuery = jest.fn()
jest.mock('../..', () => ({
  query: async (query) => mockQuery(query)
}))

describe('database/user/add', () => {
  beforeEach(() => {
    mockElectron.mockReset()
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

  test('electron', async () => {
    mockElectron.mockImplementation(() => true)
    mockQuery.mockImplementation((query) => {
      if (query.includes('SELECT')) return { rows: [] }
      else return { rows: [{ id: 'id' }] }
    })
    const user = await add({ email: 'email', password: 'password' })
    expect(user).toEqual({
      id: 'id',
      email: 'email'
    })
  })
})
