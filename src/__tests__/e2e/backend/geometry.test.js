import route from '@/route/geometry'

import { encryptSession } from '@/auth/iron'

import { GEOMETRY } from '@/config/storage'

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

const mockReadFile = jest.fn()
const mockWriteFile = jest.fn()
jest.mock('fs', () => {
  const fs = jest.requireActual('fs')
  return {
    ...fs,
    promises: {
      ...fs.promises,
      readFile: async (path) => mockReadFile(path),
      writeFile: async (path, data) => mockWriteFile(path, data)
    }
  }
})

const mockConvert = jest.fn()
jest.mock('three-to-glb', () => ({
  convert: async (path, file) => mockConvert(path, file)
}))

const mockSpawn = jest.fn()
jest.mock('child_process', () => {
  const childProcess = jest.requireActual('child_process')
  return {
    ...childProcess,
    spawn: (executable, args) => mockSpawn(executable, args)
  }
})

describe('e2e/backend/geometry', () => {
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

    mockReadFile.mockReset()
    mockWriteFile.mockReset()

    mockConvert.mockReset()
    mockConvert.mockImplementation(() => ({ data: 'data' }))

    mockSpawn.mockReset()
    mockSpawn.mockImplementation(() => ({
      stdout: {
        on: (_, callback) => callback()
      },
      stderr: {
        on: (_, callback) => callback()
      },
      on: (type, callback) => {
        if (type === 'close') callback(0)
      }
    }))

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

  test('Empty route', async () => {
    req.method = 'GET'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')
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
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // No project id
    req.body = {
      project: {}
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // No geometry
    req.body = {
      project: { id: 'id' }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // No geometry name
    req.body = {
      project: { id: 'id' },
      geometry: {}
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // No geometry uid
    req.body = {
      project: { id: 'id' },
      geometry: { name: 'name.step' }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // No geometry buffer
    req.body = {
      project: { id: 'id' },
      geometry: { name: 'name.step', uid: 'uid' }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // Error
    mockQuery.mockImplementation(() => {
      throw new Error('query error')
    })
    req.body = {
      project: { id: 'id' },
      geometry: { name: 'name.step', uid: 'uid', buffer: Buffer.from('buffer') }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'query error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('query error')
    )

    // Delete geometry
    mockQuery.mockImplementation(() => ({
      rows: [{ id: 'id' }]
    }))
    mockReadFile.mockImplementation(() => {
      throw new Error('readFile error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'readFile error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('readFile error')
    )

    // Simple
    mockReadFile.mockImplementation(() => '{}')
    await route(req, res)
    expect(mockWriteFile).toHaveBeenNthCalledWith(
      1,
      GEOMETRY + '/uid.step',
      'buffer'
    )
    expect(mockWriteFile).toHaveBeenNthCalledWith(
      2,
      GEOMETRY + '/uid.glb',
      'data'
    )
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      extension: 'step',
      glb: 'uid.glb',
      id: 'id',
      json: 'uid',
      name: 'name.step',
      originalfilename: 'name.step',
      summary: {},
      uploadfilename: 'uid.step'
    })

    // With solids, faces and edges
    let color = 0
    mockReadFile.mockImplementation((file) => {
      if (file.includes('/uid/path')) {
        color++
        if (color % 2 === 0)
          return JSON.stringify({
            uuid: 'uuid',
            data: {
              attributes: {
                color: {
                  itemSize: 3,
                  array: [0, 0.5, 1]
                }
              }
            }
          })
        else
          return JSON.stringify({
            uuid: 'uuid'
          })
      }
      return JSON.stringify({
        solids: [{ path: 'path' }, { path: 'path' }],
        faces: [{ path: 'path' }, { path: 'path' }],
        edges: [{ path: 'path' }, { path: 'path' }]
      })
    })
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      extension: 'step',
      glb: 'uid.glb',
      id: 'id',
      json: 'uid',
      name: 'name.step',
      originalfilename: 'name.step',
      summary: {
        solids: [
          { uuid: 'uuid' },
          { uuid: 'uuid', color: { r: 0, g: 0.5, b: 1 } }
        ],
        faces: [
          { uuid: 'uuid' },
          { uuid: 'uuid', color: { r: 0, g: 0.5, b: 1 } }
        ],
        edges: [
          { uuid: 'uuid' },
          { uuid: 'uuid', color: { r: 0, g: 0.5, b: 1 } }
        ]
      },
      uploadfilename: 'uid.step'
    })
  })
})
