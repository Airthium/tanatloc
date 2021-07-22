import query, { getter, updater, deleter } from '..'

const mockQuery = jest.fn(() => 'query')
jest.mock('pg', () => {
  return {
    Pool: class PoolMock {
      constructor() {
        this.connect = async () => ({
          query: async () => mockQuery(),
          release: jest.fn()
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
  test('query', async () => {
    const res = await query()
    expect(res).toBe('query')
  })

  test('getter', async () => {
    const get = await getter('db', 'id', [])
    expect(get).toBe('query')
  })

  test('updater', async () => {
    await updater('db', 'id', [
      { key: 'key1' },
      { key: 'key2', type: 'crypt' },
      { key: 'key3', type: 'array', method: 'append' },
      { key: 'key4', type: 'array', method: 'remove' },
      {
        key: 'key5',
        type: 'json',
        method: 'set',
        path: ['first', 'second'],
        value: 'value'
      },
      { key: 'key6', type: 'json', method: 'erase', path: ['first', 'second'] }
    ])

    await updater('db', null, [{ key: 'key' }])

    try {
      await updater('db', 'id', [{ key: 'key' }, { key: 'key' }])
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    try {
      await updater('db', 'id', [{ key: 'key', type: 'array' }])
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    try {
      await updater('db', 'id', [
        { key: 'key', type: 'json', method: 'set', path: ['first', 'second'] }
      ])
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    try {
      await updater('db', 'id', [{ key: 'key', type: 'json' }])
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  test('deleter', async () => {
    await deleter()
  })
})
