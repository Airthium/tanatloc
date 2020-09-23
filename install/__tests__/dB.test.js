import createTables from '../dB'

let mockQuery = () => ({ rows: [{}] })
jest.mock('../../src/database', () => {
  return async (query) => mockQuery(query)
})

describe('install/dB', () => {
  it('empty', async () => {
    await createTables()
  })

  it('admin & exists', async () => {
    mockQuery = (query) => {
      if (query.includes('SELECT id FROM')) return { rows: [] }
      else return { rows: [{ exists: true }] }
    }
    await createTables()
  })

  it('error', async () => {
    mockQuery = () => {
      throw new Error()
    }
    await createTables()
  })
})
