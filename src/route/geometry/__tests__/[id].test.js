import id from '../[id]'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockCheckGeometryAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkGeometryAuth: async () => mockCheckGeometryAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/geometry', () => ({
  update: async () => mockUpdate(),
  del: () => mockDel()
}))

describe('route/geometry/[id]', () => {
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

    mockCheckGeometryAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

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
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  test('no id', async () => {
    req.method = 'GET'
    req.query = {}
    req.params = {}

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
  })

  test('access denied', async () => {
    req.method = 'GET'
    req.query = { id: 'id' }
    req.params = {}

    mockCheckGeometryAuth.mockImplementation(() => {
      const error = new Error('Access denied')
      error.status = 403
      throw error
    })

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
  })

  test('Update', async () => {
    req.method = 'PUT'
    req.query = {}
    req.params = { id: 'id' }

    // Wrong body
    req.body = {}
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body(array))'
    })

    // Normal
    req.body = []
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    req.body = []
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Update error' })
  })

  test('DELETE', async () => {
    req.method = 'DELETE'
    req.query = { id: 'id' }
    req.params = {}

    // Normal
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('Delete error')
    })
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Delete error' })
  })

  test('wrong method', async () => {
    req.method = 'method'
    req.query = { id: 'id' }

    mockCheckGeometryAuth.mockImplementation(() => true)

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
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
