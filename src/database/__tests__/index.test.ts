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
    // First good
    mockQuery.mockImplementation(() => true)
    await checkdB()

    // First wrong, no id
    mockQuery.mockImplementation(() => {
      throw new Error('query error')
    })
    mockExecSync
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => '')
    try {
      await checkdB()
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Database not found')
    }

    // Second wrong, no docker
    mockExecSync
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => {
        throw new Error('no docker')
      })
    try {
      await checkdB()
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Database not found')
    }

    // Second wrong, does not start
    mockExecSync
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => 'id')
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => 'host')
    try {
      await checkdB()
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Unable to start database')
    }

    // Second true, already exists, start
    mockQuery
      .mockImplementationOnce(() => {
        throw new Error('query error')
      })
      .mockImplementation(() => '')
    mockExecSync
      .mockImplementationOnce(() => 'id')
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => 'host')
    await checkdB()
  })

  test('startdB', async () => {
    Object.defineProperty(process.env, 'DB_HOST', {
      value: null,
      configurable: true
    })
    let pool = startdB()
    expect(pool).toBe(mockPool)

    Object.defineProperty(process.env, 'DB_HOST', {
      value: 'host',
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
