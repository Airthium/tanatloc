import query, { getter, updater, deleter } from '..'

jest.mock('pg', () => {
  return {
    Pool: class PoolMock {
      constructor() {
        this.connect = async () => ({
          query: async () => 'query',
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

    // await updater('db', 'id', { type: 'json', method: 'diff' })
  })

  it('deleter', async () => {
    await deleter()
  })
})
