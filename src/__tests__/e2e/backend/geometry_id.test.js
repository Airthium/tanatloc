import route from '@/route/geometry/[id]'

import { encryptSession } from '@/auth/iron'

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

const mockRm = jest.fn()
const mockUnlink = jest.fn()
jest.mock('fs', () => {
  const fs = jest.requireActual('fs')
  return {
    ...fs,
    promises: {
      ...fs.promises,
      rm: (dir) => mockRm(dir),
      unlink: (file) => mockUnlink(file)
    }
  }
})

describe('e2e/backend/geometry/[id]', () => {
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

    resStatus = undefined
    resJson = undefined
  })

  test('Unauthorized', async () => {
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ message: 'Unauthorized' })
  })

  test('Unauthorized 2', async () => {
    req.query = { id: 'id' }
    await setToken()

    // Normal
    mockQuery.mockImplementation(() => ({ rows: [{ id: 'id' }] }))
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })

    // Error
    mockQuery.mockImplementation(() => {
      throw new Error('query error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'query error' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('query error')
    )
  })

  test('Wrong method', async () => {
    req.query = {}
    req.params = { id: 'id' }
    req.method = 'method'
    await setToken()

    mockQuery.mockImplementation(() => ({
      rows: [{ id: 'id', owners: ['id'] }]
    }))
    await route(req, res)
    expect(resStatus).toBe(405)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })

  test('Get geometry', async () => {
    req.query = { id: 'id' }
    req.method = 'GET'
    await setToken()

    // Normal
    mockQuery.mockImplementation((command) => {
      if (
        command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
        command ===
          'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1'
      )
        return { rows: [{ id: 'id', owners: ['id'] }] }

      return { rows: [{ id: 'id' }] }
    })
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ geometry: { id: 'id' } })

    // Error
    mockQuery.mockImplementation((command) => {
      if (
        command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
        command ===
          'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1' ||
        command ===
          'SELECT owners,users,groups FROM tanatloc_workspaces WHERE id = $1'
      )
        return { rows: [{ id: 'id', owners: ['id'] }] }

      throw new Error('query error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'query error' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('query error')
    )
  })

  test('Update geometry', async () => {
    req.query = { id: 'id' }
    req.method = 'PUT'
    await setToken()

    // Wrong data
    mockQuery.mockImplementation((command) => {
      if (
        command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
        command ===
          'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1'
      )
        return { rows: [{ id: 'id', owners: ['id'] }] }

      return { rows: [{ id: 'id' }] }
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body(array))'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body(array))')
    )

    // Normal
    req.body = [{ key: 'key', value: 'value' }]
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')
    expect(mockQuery).toHaveBeenLastCalledWith(
      'UPDATE tanatloc_geometries SET key = $2 WHERE id = $1',
      ['id', 'value']
    )

    // Error
    mockQuery.mockImplementation((command) => {
      if (
        command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
        command ===
          'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1' ||
        command ===
          'SELECT owners,users,groups FROM tanatloc_workspaces WHERE id = $1'
      )
        return { rows: [{ id: 'id', owners: ['id'] }] }

      throw new Error('query error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'query error' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('query error')
    )
  })

  test('Delete geometry', async () => {
    req.query = { id: 'id' }
    req.method = 'DELETE'
    await setToken()

    // Normal
    mockQuery.mockImplementation((command) => {
      if (
        command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
        command ===
          'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1'
      )
        return { rows: [{ id: 'id', owners: ['id'] }] }

      return { rows: [{ id: 'id' }] }
    })
    await route(req, res)
    expect(mockQuery).toHaveBeenNthCalledWith(
      4,
      'SELECT extension,uploadfilename,glb,json,project FROM tanatloc_geometries WHERE id = $1',
      ['id']
    )
    expect(mockQuery).toHaveBeenNthCalledWith(
      5,
      'UPDATE tanatloc_projects SET geometries = array_remove(geometries, $1)',
      ['id']
    )
    expect(mockQuery).toHaveBeenNthCalledWith(
      6,
      'DELETE FROM tanatloc_geometries WHERE id = $1',
      ['id']
    )
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')

    // With uploadfilename, glb & json
    mockQuery.mockClear()
    mockQuery.mockImplementation((command) => {
      if (
        command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
        command ===
          'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1' ||
        command ===
          'SELECT owners,users,groups FROM tanatloc_workspaces WHERE id = $1'
      )
        return { rows: [{ id: 'id', owners: ['id'] }] }
      else if (
        command ===
        'SELECT extension,uploadfilename,glb,json,project FROM tanatloc_geometries WHERE id = $1'
      )
        return {
          rows: [
            {
              id: 'id',
              uploadfilename: 'uploadfilename',
              glb: 'glb',
              json: 'json'
            }
          ]
        }
      return { rows: [{ id: 'id' }] }
    })
    await route(req, res)
    expect(mockUnlink).toHaveBeenNthCalledWith(
      1,
      '/home/simon/tanatloc/geometry/uploadfilename'
    )
    expect(mockUnlink).toHaveBeenNthCalledWith(
      2,
      '/home/simon/tanatloc/geometry/glb'
    )
    expect(mockRm).toHaveBeenLastCalledWith(
      '/home/simon/tanatloc/geometry/json'
    )
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')

    // unlink & rm errors
    mockUnlink.mockImplementation(() => {
      throw new Error('unlink error')
    })
    mockRm.mockImplementation(() => {
      throw new Error('rm error')
    })
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')
  })
})
