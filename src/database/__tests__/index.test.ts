import { query, getter, updater, deleter, checkdB, startdB, stopdB } from '..'

const mockExecSync = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync()
}))

const mockQuery = jest.fn()
const mockPool = {
  connect: async () => ({
    query: async () => mockQuery(),
    release: jest.fn()
  }),
  query: async () => mockQuery(),
  end: jest.fn()
}

jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => mockPool)
  }
})

Object.defineProperty(global, 'setTimeout', {
  value: (callback: Function) => callback()
})

describe('database', () => {
  beforeEach(() => {
    //@ts-ignore
    global.tanatloc = {
      pool: mockPool
    }

    mockExecSync.mockReset()
    mockExecSync.mockImplementation(() => 'id')

    mockQuery.mockReset()
    mockQuery.mockImplementation(() => 'query')
  })

  test('checkdB', async () => {
    // Docker no id
    mockExecSync.mockImplementation(() => '')
    await checkdB()

    // Docker, id on run
    mockExecSync
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => 'id')
    await checkdB()

    // Docker, id on container
    mockExecSync.mockImplementation(() => 'id')
    await checkdB()

    // Docker not ready
    mockQuery.mockImplementation(() => {
      throw new Error('query error')
    })
    try {
      await checkdB()
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Unable to start database')
    }
  })

  test('startdB', async () => {
    Object.defineProperty(process.env, 'DB_HOST', {
      value: null,
      configurable: true
    })
    Object.defineProperty(process.env, 'DB_PORT', {
      value: null,
      configurable: true
    })
    let pool = startdB()
    expect(pool).toBe(mockPool)

    Object.defineProperty(process.env, 'DB_HOST', {
      value: 'host',
      configurable: true
    })
    Object.defineProperty(process.env, 'DB_PORT', {
      value: '5433',
      configurable: true
    })
    pool = startdB()
    expect(pool).toBe(mockPool)
  })

  test('stopdB', async () => {
    await stopdB()

    //@ts-ignore
    global.tanatloc.pool = undefined
    await stopdB()
  })

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
      { key: 'key5', type: 'array', method: 'set', index: 1, value: '' },
      {
        key: 'key6',
        type: 'json',
        method: 'set',
        path: ['first', 'second'],
        value: 'value'
      },
      {
        key: 'key7',
        type: 'json',
        method: 'erase',
        path: ['first', 'second'],
        value: ''
      },
      { key: 'key8', type: 'date', value: 123 },
      {
        key: 'key9',
        type: 'json',
        method: 'set',
        path: ['first', 'second'],
        value: ['array']
      }
    ])

    await updater('db', undefined, [{ key: 'key', value: '' }])

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
