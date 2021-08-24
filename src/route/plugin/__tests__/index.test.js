import plugin from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockUserGet = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async () => mockUserGet()
}))

const mockAdd = jest.fn()
const mockGetByUser = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/plugin', () => ({
  add: async () => mockAdd(),
  getByUser: async () => mockGetByUser(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

describe('route/plugin', () => {
  const req = {}
  let resStatus
  let resJson
  const res = {
    status: (status) => {
      resStatus = status
      return {
        json: (obj) => {
          resJson = obj
        },
        end: () => {
          resJson = 'end'
        }
      }
    }
  }

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockUserGet.mockReset()
    mockUserGet.mockImplementation(() => ({}))

    mockAdd.mockReset()
    mockGetByUser.mockReset()
    mockGetByUser.mockImplementation(() => [])
    mockUpdate.mockReset()
    mockDel.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    req.body = {}
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { key(string), needInit(?bool), configuration(object) }'
    })

    // Access denied
    req.body = {
      key: 'key',
      configuration: {}
    }
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockUserGet.mockImplementation(() => ({ authorizedplugins: ['key'] }))
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('Add error')
    })
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockUserGet).toHaveBeenCalledTimes(3)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(3)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Add error' })
  })

  test('GET', async () => {
    req.method = 'GET'

    // Normal
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      plugins: []
    })

    // Error
    mockGetByUser.mockImplementation(() => {
      throw new Error('Get error')
    })
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get error'
    })
  })

  test('PUT', async () => {
    req.method = 'PUT'

    // Wrong body
    req.body = undefined
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body(object)}'
    })

    // Normal
    req.body = {}
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Update error' })
  })

  test('DELETE', async () => {
    req.method = 'DELETE'

    // Wrong body
    req.body = {}
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { uuid(uuid) } }'
    })

    // Normal
    req.body = { uuid: 'uuid' }
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('Delete error')
    })
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Delete error' })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
