import group from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockOrganizationGet = jest.fn()
jest.mock('@/lib/organization', () => ({
  get: async () => mockOrganizationGet()
}))

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/group', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

describe('route/group', () => {
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

    mockOrganizationGet.mockReset()
    mockOrganizationGet.mockImplementation(() => ({}))

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockGet.mockReset()
    mockGet.mockImplementation(() => ({}))
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
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  test('Add', async () => {
    req.method = 'POST'

    // Wrong body
    req.body = {}
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
    })

    // Access denied
    req.body = {
      organization: { id: 'id' },
      group: { name: 'Test group', users: [] }
    }
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Invalid organization
    mockOrganizationGet.mockImplementation(() => {
      // Empty
    })
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(3)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Invalid organization identifier'
    })

    // Normal
    mockOrganizationGet.mockImplementation(() => ({
      owners: ['id']
    }))
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(3)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      id: 'id'
    })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('Add error')
    })
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(5)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(4)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(4)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Add error'
    })
  })

  test('Update', async () => {
    req.method = 'PUT'

    // Wrong body
    req.body = {}
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(0)
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

    // Invalid group
    mockGet.mockImplementation(() => {
      // Empty
    })
    req.body = { id: 'id', data: [] }
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Invalid group identifier'
    })

    // Access denied
    mockGet.mockImplementation(() => ({}))
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(1)
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
    mockOrganizationGet.mockImplementation(() => ({ owners: ['id'] }))
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(2)
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
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(5)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(3)
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
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(0)
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

    // Normal
    mockOrganizationGet.mockImplementation(() => ({ owners: ['id'] }))
    req.body = { id: 'id' }
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('Delete error')
    })
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Delete error' })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockOrganizationGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
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
