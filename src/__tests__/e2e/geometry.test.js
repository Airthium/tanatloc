import route from '@/route/geometry'

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

describe('e2e/geoemtry', () => {
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
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(string) } })'
    })

    // No project id
    req.body = {
      project: {}
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(string) } })'
    })

    // No geometry
    req.body = {
      project: { id: 'id' }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(string) } })'
    })

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
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(string) } })'
    })

    // No geometry uid
    req.body = {
      project: { id: 'id' },
      geometry: { name: 'name' }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(string) } })'
    })

    // No geometry buffer
    req.body = {
      project: { id: 'id' },
      geometry: { name: 'name', uid: 'uid' }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(string) } })'
    })

    // Error
    mockQuery.mockImplementation(() => {
      throw new Error('error')
    })
    req.body = {
      project: { id: 'id' },
      geometry: { name: 'name', uid: 'uid', buffer: 'buffer' }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'error'
    })

    //TODO
  })
})
