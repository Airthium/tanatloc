import createTables from '../dB'

let mockQuery = () => ({ rows: [] })
jest.mock('../../src/database', () => {
  return async () => mockQuery()
})

describe('dB install', () => {
  it('empty', async () => {
    await createTables()
  })

  it('admin', async () => {
    mockQuery = () => ({ rows: [{}] })
    await createTables()
  })

  it('error', async () => {
    mockQuery = () => {
      throw new Error()
    }
    await createTables()
  })
})
