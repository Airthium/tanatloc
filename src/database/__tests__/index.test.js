import query, { getter, updater, deleter } from '..'

const mockQuery = jest.fn(() => 'query')
jest.mock('pg', () => {
  return {
    Pool: class PoolMock {
      constructor() {
        this.connect = async () => ({
          query: async () => mockQuery(),
          release: () => {}
        })
        this.query = async () => 'query'
        this.end = jest.fn()
      }
    }
  }
})

jest.mock('@/config/db', () => {
  return {}
})

describe('database', () => {
  it('query', async () => {
    const res = await query()
    expect(res).toBe('query')
  })

  it('getter', async () => {
    const get = await getter('db', 'id', [])
    expect(get).toBe('query')
  })

  it('updater', async () => {
    await updater('db', 'id', {})

    await updater('db', 'id', { type: 'crypt' })

    try {
      await updater('db', 'id', { type: 'array' })
    } catch (err) {}

    await updater('db', 'id', { type: 'array', method: 'append' })

    try {
      await updater('db', 'id', { type: 'array', method: 'replace' })
    } catch (err) {}

    await updater('db', 'id', { type: 'array', method: 'remove' })

    try {
      await updater('db', 'id', { type: 'array', method: 'switch' })
    } catch (err) {}

    mockQuery.mockImplementation(() => ({
      rows: [
        {
          scheme: {
            first: {
              second: {}
            }
          }
        }
      ]
    }))
    await updater('db', 'id', {
      type: 'json',
      method: 'diff',
      key: 'scheme',
      path: ['first', 'second']
    })

    await updater('db', 'id', {
      type: 'json',
      method: 'erase',
      key: 'scheme',
      path: ['first', 'second']
    })

    try {
      await updater('db', 'id', {
        type: 'json',
        method: 'other'
      })
    } catch (err) {}
  })

  it('deleter', async () => {
    await deleter()
  })
})
