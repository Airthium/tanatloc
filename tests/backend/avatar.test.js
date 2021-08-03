import route from '@/route/avatar'

import { encryptSession } from '@/auth/iron'

import { tables } from '@/config/db'
import { AVATAR } from '@/config/storage'

const mockQuery = jest.fn()
jest.mock('pg', () => {
  return {
    Pool: class PoolMock {
      constructor() {
        this.connect = async () => ({
          query: async (command, args) => mockQuery(command, args),
          release: jest.fn()
        })
        this.query = async () => 'query'
        this.end = jest.fn()
      }
    }
  }
})

const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  captureException: (err) => mockCaptureException(err)
}))

const mockUnlink = jest.fn()
const mockWriteFile = jest.fn()
jest.mock('fs', () => {
  const fs = jest.requireActual('fs')
  return {
    ...fs,
    promises: {
      ...fs.promises,
      unlink: (file) => mockUnlink(file),
      writeFile: (path, data) => mockWriteFile(path, data)
    }
  }
})

describe('e2e/backend/avatar', () => {
  const req = {}
  let resStatus
  let resJson
  const res = {
    status: (code) => {
      resStatus = code
      return {
        json: (object) => {
          resJson = object
        },
        end: () => {
          resJson = 'end'
        }
      }
    }
  }

  const setToken = async () => {
    req.headers = {
      cookie: 'token=' + (await encryptSession({ id: 'id' })) + ';'
    }
  }

  beforeEach(() => {
    mockQuery.mockReset()

    mockCaptureException.mockReset()

    mockUnlink.mockReset()
    mockWriteFile.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('Unauthorized', async () => {
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ message: 'Unauthorized' })
  })

  test('Wrong method', async () => {
    req.method = 'method'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(405)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Method method not allowed')
    )
  })

  test('Add', async () => {
    req.method = 'POST'
    await setToken()

    // No body
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Empty body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Empty body file
    req.body = {
      file: {}
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Empty body file uid
    req.body = {
      file: {
        name: 'name'
      }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Empty body file data
    req.body = {
      file: {
        name: 'name',
        uid: 'uid'
      }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { ?project: { id(uuid) }, file: { name(string), uid(uuid), data(string) } })'
      )
    )

    // Body with file
    mockQuery.mockImplementation(() => ({
      rows: [{ id: 'id' }]
    }))
    req.body = {
      file: {
        name: 'name',
        uid: 'uid',
        data: 'data'
      }
    }
    await route(req, res)
    expect(mockQuery).toHaveBeenNthCalledWith(
      1,
      'INSERT INTO ' +
        tables.AVATARS +
        ' (name, path) VALUES ($1, $2) RETURNING id',
      ['name', 'uid']
    )
    expect(mockQuery).toHaveBeenNthCalledWith(
      2,
      'SELECT avatar FROM ' + tables.USERS + ' WHERE id = $1',
      ['id']
    )
    expect(mockQuery).toHaveBeenNthCalledWith(
      3,
      'UPDATE ' + tables.USERS + ' SET avatar = $2 WHERE id = $1',
      ['id', 'id']
    )
    expect(mockWriteFile).toHaveBeenLastCalledWith(AVATAR + '/uid', 'data')
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ id: 'id', name: 'name' })

    // Body with project & file
    req.body = {
      project: { id: 'id' },
      file: {
        name: 'name',
        uid: 'uid',
        data: 'data'
      }
    }
    await route(req, res)
    expect(mockQuery).toHaveBeenNthCalledWith(
      4,
      'INSERT INTO ' +
        tables.AVATARS +
        ' (name, path) VALUES ($1, $2) RETURNING id',
      ['name', 'uid']
    )
    expect(mockQuery).toHaveBeenNthCalledWith(
      5,
      'SELECT avatar FROM ' + tables.PROJECTS + ' WHERE id = $1',
      ['id']
    )
    expect(mockQuery).toHaveBeenNthCalledWith(
      6,
      'UPDATE ' + tables.PROJECTS + ' SET avatar = $2 WHERE id = $1',
      ['id', 'id']
    )
    expect(mockWriteFile).toHaveBeenLastCalledWith(AVATAR + '/uid', 'data')
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ id: 'id', name: 'name' })

    // Body with file, previous avatar
    mockQuery.mockImplementation((command) => {
      if (command === 'SELECT avatar FROM ' + tables.USERS + ' WHERE id = $1')
        return {
          rows: [{ avatar: 'id' }]
        }
      else if (
        command ===
        'SELECT path FROM ' + tables.AVATARS + ' WHERE id = $1'
      )
        return {
          rows: [{}]
        }
      return {
        rows: [{ id: 'id' }]
      }
    })
    req.body = {
      file: {
        name: 'name',
        uid: 'uid',
        data: 'data'
      }
    }
    await route(req, res)
    expect(mockWriteFile).toHaveBeenLastCalledWith(AVATAR + '/uid', 'data')
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ id: 'id', name: 'name' })

    // Body with project & file, previous avatar
    mockQuery.mockImplementation((command) => {
      if (
        command ===
        'SELECT avatar FROM ' + tables.PROJECTS + ' WHERE id = $1'
      )
        return {
          rows: [{ avatar: 'id' }]
        }
      else if (
        command ===
        'SELECT path FROM ' + tables.AVATARS + ' WHERE id = $1'
      )
        return {
          rows: [{ path: 'path' }]
        }
      return {
        rows: [{ id: 'id' }]
      }
    })
    req.body = {
      project: { id: 'id' },
      file: {
        name: 'name',
        uid: 'uid',
        data: 'data'
      }
    }
    await route(req, res)
    expect(mockWriteFile).toHaveBeenLastCalledWith(AVATAR + '/uid', 'data')
    expect(mockUnlink).toHaveBeenLastCalledWith(AVATAR + '/path')
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ id: 'id', name: 'name' })

    // Unlink error
    mockUnlink.mockImplementation(() => {
      throw new Error('unlink error')
    })
    await route(req, res)
    expect(mockWriteFile).toHaveBeenLastCalledWith(AVATAR + '/uid', 'data')
    expect(mockUnlink).toHaveBeenLastCalledWith(AVATAR + '/path')
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ id: 'id', name: 'name' })
  })
})
