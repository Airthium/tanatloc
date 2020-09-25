import createDatabase from '../dB'

let mockQuery = () => ({ rows: [{}] })
jest.mock('../../src/database', () => {
  return async (query) => mockQuery(query)
})

let mockClient
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
    mockClient = () => ({
      query: async () => ({
        rowCount: 0
      }),
      release: () => {}
    })
  })

  it('alreadyExists', async () => {
    mockClient = () => ({
      query: async () => ({
        rowCount: 1
      }),
      release: () => {}
    })
    await createDatabase()
  })

  it('database error', async () => {
    mockClient = () => ({})
    await createDatabase()
  })

  it('empty', async () => {
    await createDatabase()
  })

  it('admin & exists', async () => {
    mockQuery = (query) => {
      if (query.includes('SELECT id FROM')) return { rows: [] }
      else return { rows: [{ exists: true }] }
    }
    await createDatabase()
  })

  it('tables error', async () => {
    mockQuery = () => {
      throw new Error()
    }
    await createDatabase()
  })
})
