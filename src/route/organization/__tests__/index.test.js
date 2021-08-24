import organization from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/organization', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

describe('route/organization', () => {
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
    mockSession.mockImplementation(() => 'id')

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockGet.mockReset()
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
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
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
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { name(string) })'
    })

    // Normal
    req.body = {
      name: 'Test organization'
    }
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      id: 'id'
    })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('Add error')
    })
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Add error'
    })
  })

  test('PUT', async () => {
    req.method = 'PUT'

    // Wrong body
    req.body = {}
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid), data(array) })'
    })

    // Invalid organization
    req.body = { id: 'id', data: [] }
    mockGet.mockImplementation(() => {
      // Empty
    })
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Invalid organization identifier'
    })

    // Access denied
    mockGet.mockImplementation(() => ({}))
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(3)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockGet.mockImplementation(() => ({ owners: ['id'] }))
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(3)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(5)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(4)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Update error'
    })
  })

  test('DELETE', async () => {
    req.method = 'DELETE'

    // Wrong body
    req.body = {}
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid) })'
    })

    // Access denied
    req.body = { id: 'id' }
    mockGet.mockImplementation(() => ({}))
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockGet.mockImplementation(() => ({ owners: ['id'] }))
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('Delete error')
    })
    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(3)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Delete error' })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await organization(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
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
