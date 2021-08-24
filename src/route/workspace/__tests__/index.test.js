import workspace from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockCheckWorkspaceAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkWorkspaceAuth: async () => mockCheckWorkspaceAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockGetByUser = jest.fn()
const mockAdd = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/workspace', () => ({
  getByUser: async () => mockGetByUser(),
  add: async () => mockAdd(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

describe('route/workspace', () => {
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

    mockCheckWorkspaceAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockGetByUser.mockReset()
    mockGetByUser.mockImplementation(() => [{ id: 'id', name: 'name' }])
    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
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
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  test('GET', async () => {
    req.method = 'GET'

    // Normal
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      workspaces: [
        {
          id: 'id',
          name: 'name'
        }
      ]
    })

    // Error
    mockGetByUser.mockImplementation(() => {
      throw new Error('Get error')
    })
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Get error' })
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    req.body = {}
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
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
      name: 'Test workspace'
    }
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ id: 'id' })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('Add error')
    })
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Add error' })
  })

  test('PUT', async () => {
    req.method = 'PUT'

    // Wrong body
    req.body = {}
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { workspace: { id(uuid) }, data(array) })'
    })

    // Access denied
    req.body = {
      workspace: { id: 'id' },
      data: []
    }
    mockCheckWorkspaceAuth.mockImplementation(() => {
      const error = new Error('Access denied')
      error.status = 403
      throw error
    })
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockCheckWorkspaceAuth.mockReset()
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(1)
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
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(2)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
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
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
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
    mockCheckWorkspaceAuth.mockImplementation(() => {
      const error = new Error('Access denied')
      error.status = 403
      throw error
    })
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockCheckWorkspaceAuth.mockReset()
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(1)
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
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(2)
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

    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckWorkspaceAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
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
