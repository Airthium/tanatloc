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
    let fix = true
    mockQuery.mockImplementation((query) => {
      if (query.includes('SELECT id FROM')) return { rows: [] }
      else if (
        query.includes('SELECT column_name') &&
        query.includes('tanatloc_system')
      )
        return {
          rows: [
            {
              column_name: 'allowsignup',
              data_type: 'boolean',
              is_nullable: 'NO'
            },
            {
              column_name: 'password',
              data_type: 'jsonb'
            }
          ]
        }
      else if (query.includes('SELECT column_name'))
        return {
          rows: [
            {
              column_name: 'name',
              data_type: 'jsonb'
            },
            {
              column_name: 'owners',
              data_type: 'ARRAY',
              is_nullable: 'NO'
            },
            {
              column_name: 'id',
              data_type: 'UUID',
              is_nullable: 'YES'
            }
          ]
        }
      else if (query.includes('ALTER TABLE')) {
        if (fix) return {}
        else throw new Error()
      } else return { rows: [{ exists: true }] }
    })
    await createDatabase()

    // Fix error
    fix = false
    await createDatabase()
  })

  it('tables error', async () => {
    mockQuery.mockImplementation(() => {
      throw new Error()
    })
    await createDatabase()
  })
})
