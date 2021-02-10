import createDatabase from '../dB'

const mockQuery = jest.fn()
jest.mock('@/database', () => {
  return async (query) => mockQuery(query)
})

const mockClient = jest.fn()
jest.mock('pg', () => ({
  Pool: class {
    constructor() {
      this.connect = () => mockClient()
      this.end = () => {}
    }
  }
}))

describe('install/dB', () => {
  beforeEach(() => {
    mockClient.mockImplementation(() => ({
      query: async () => ({
        rowCount: 0
      }),
      release: () => {}
    }))
    mockQuery.mockImplementation(() => ({ rows: [{}] }))
  })

  it('alreadyExists', async () => {
    mockClient.mockImplementation(() => ({
      query: async () => ({
        rowCount: 1
      }),
      release: () => {}
    }))
    await createDatabase()
  })

  it('database error', async () => {
    mockClient.mockImplementation(() => ({}))
    await createDatabase()
  })

  it('empty', async () => {
    await createDatabase()
  })

  it('admin & exists', async () => {
    mockQuery.mockImplementation((query) => {
      if (query.includes('SELECT id FROM')) return { rows: [] }
      else return { rows: [{ exists: true }] }
    })
    await createDatabase()
  })

  it('tables error', async () => {
    mockQuery.mockImplementation(() => {
      throw new Error()
    })
    await createDatabase()
  })
})
