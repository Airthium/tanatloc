import query, { getter, updater, deleter } from '..'

let mockQuery = () => 'query'
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

jest.mock('../../../config/db', () => {
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

    await updater('db', 'id', { type: 'array' })

    await updater('db', 'id', { type: 'array', method: 'append' })

    await updater('db', 'id', { type: 'array', method: 'replace' })

    await updater('db', 'id', { type: 'array', method: 'remove' })

    await updater('db', 'id', { type: 'array', method: 'switch' })

    mockQuery = () => ({
      rows: [
        {
          scheme: {
            first: {
              second: {}
            }
          }
        }
      ]
    })
    await updater('db', 'id', {
      type: 'json',
      method: 'diff',
      key: 'scheme',
      path: ['first', 'second']
    })

    await updater('db', 'id', {
      type: 'json',
      method: 'other'
    })
  })

  it('deleter', async () => {
    await deleter()
  })
})
