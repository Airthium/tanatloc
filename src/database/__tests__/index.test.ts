import { query, getter, updater, deleter } from '..'

jest.mock('child_process', () => ({
  execSync: () => ''
}))

const mockQuery = jest.fn(() => 'query')
jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      connect: async () => ({
        query: async () => mockQuery(),
        release: jest.fn()
      }),
      query: async () => 'query',
      end: jest.fn()
    }))
  }
})

jest.mock('@/config/db', () => {
  return {}
})

describe('database', () => {
  test('query', async () => {
    const res = await query('', [])
    expect(res).toBe('query')
  })

  test('getter', async () => {
    const get = await getter('db', 'id', [])
    expect(get).toBe('query')
  })

  test('updater', async () => {
    await updater('db', 'id', [
      { key: 'key1', value: '' },
      { key: 'key2', type: 'crypt', value: '' },
      { key: 'key3', type: 'array', method: 'append', value: '' },
      { key: 'key4', type: 'array', method: 'remove', value: '' },
      {
        key: 'key5',
        type: 'json',
        method: 'set',
        path: ['first', 'second'],
        value: 'value'
      },
      {
        key: 'key6',
        type: 'json',
        method: 'erase',
        path: ['first', 'second'],
        value: ''
      },
      { key: 'key7', type: 'date', value: 123 }
    ])

    await updater('db', null, [{ key: 'key', value: '' }])

    try {
      await updater('db', 'id', [
        { key: 'key', value: '' },
        { key: 'key', value: '' }
      ])
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    try {
      await updater('db', 'id', [{ key: 'key', type: 'array', value: '' }])
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    try {
      await updater('db', 'id', [
        {
          key: 'key',
          type: 'json',
          method: 'set',
          path: ['first', 'second'],
          value: ''
        }
      ])
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    try {
      await updater('db', 'id', [{ key: 'key', type: 'json', value: '' }])
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  test('deleter', async () => {
    await deleter('', '')
  })
})
