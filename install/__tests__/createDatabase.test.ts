/**
 * @jest-environment node
 */

import { createDatabase } from '../createDatabase'

jest.mock('@airthium/pg-format', () => (str: string) => str)

const mockQuery = jest.fn()
jest.mock('@/database', () => ({
  query: async (query: string) => mockQuery(query)
}))

const mockClient = jest.fn()
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: () => mockClient(),
    end: jest.fn()
  }))
}))

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

const mockInit = jest.fn()
jest.mock('@/server/init/database', () => ({
  initDatabase: async () => mockInit()
}))

describe('install/dB', () => {
  beforeEach(() => {
    mockIsElectron.mockReset()
    mockIsElectron.mockImplementation(() => false)

    mockClient.mockImplementation(() => ({
      query: async () => ({
        rowCount: 0
      }),
      release: jest.fn()
    }))
    mockQuery.mockImplementation(() => ({
      rows: [{ email: 'admin', authorizedplugins: [], plugins: [] }]
    }))

    Object.defineProperty(global, 'tanatloc', {
      value: {
        pool: {
          connect: () => mockClient(),
          end: jest.fn()
        }
      },
      configurable: true
    })
  })

  test('Database not found', async () => {
    await createDatabase()
  })

  test('alreadyExists', async () => {
    mockClient.mockImplementation(() => ({
      query: async () => ({
        rowCount: 1
      }),
      release: jest.fn()
    }))
    await createDatabase()
  })

  test('database error', async () => {
    mockClient.mockImplementation(() => ({}))
    try {
      await createDatabase()
    } catch (err) {}
  })

  test('empty', async () => {
    await createDatabase()
  })

  test('admin & exists', async () => {
    let fixConstraint = true
    let fix = true
    let fixUnused = true
    mockQuery.mockImplementation((query) => {
      if (query.includes('SELECT * FROM')) return { rows: [] }
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
        if (fixUnused)
          return {
            rows: [
              {
                column_name: 'name',
                data_type: 'jsonb'
              },
              {
                column_name: 'owners',
                data_type: 'UUID[]',
                is_nullable: 'NO'
              },
              {
                column_name: 'id',
                data_type: 'UUID',
                is_nullable: 'YES'
              }
            ]
          }
        else return { rows: [] }
      else if (query.includes('ALTER TABLE'))
        if (query.includes('ALTER COLUMN') && query.includes('TEXT')) {
          if (fixConstraint) return {}
          else throw new Error()
        } else if (
          query.includes('DROP COLUMN') &&
          query.includes('tanatloc_links')
        ) {
          return {}
        } else {
          if (fix) return {}
          else throw new Error()
        }
      else return { rows: [{ exists: true }] }
    })
    await createDatabase()

    // Fix error
    fix = false
    await createDatabase()

    fixConstraint = false
    fix = false
    await createDatabase()

    // No fix unused
    fixUnused = false
    await createDatabase()
  })

  test('tables error', async () => {
    mockQuery.mockImplementation(() => {
      throw new Error()
    })
    try {
      await createDatabase()
    } catch (err) {}
  })

  test('admin', async () => {
    mockQuery.mockImplementation((query) => {
      if (query.includes('SELECT * FROM'))
        return {
          rows: [{ email: 'admin', authorizedplugins: ['loal'], plugins: [{}] }]
        }
      else return { rows: [{ exists: true }] }
    })
    mockIsElectron.mockImplementation(() => true)
    await createDatabase()
  })
})
