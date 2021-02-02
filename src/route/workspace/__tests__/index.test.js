import workspace from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockAuth = jest.fn()
jest.mock('../../auth', () => () => mockAuth())

const mockGetByUser = jest.fn()
const mockGet = jest.fn()
const mockAdd = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/workspace', () => ({
  getByUser: async () => mockGetByUser(),
  get: async () => mockGet(),
  add: async () => mockAdd(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('pages/api/workspace', () => {
  let req, response
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      },
      end: () => {
        response = 'end'
      }
    })
  }

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockAuth.mockReset()
    mockAuth.mockImplementation(() => false)

    mockGetByUser.mockReset()
    mockGetByUser.mockImplementation(() => [{ id: 'id', name: 'name' }])
    mockGet.mockReset()
    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockError.mockReset()

    req = {
      method: 'GET'
    }
  })

  it('no session', async () => {
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    mockSession.mockImplementation(() => true)

    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      workspaces: [
        {
          id: 'id',
          name: 'name'
        }
      ]
    })

    // Error
    mockGetByUser.mockImplementation(() => {
      throw new Error('test')
    })
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('POST', async () => {
    req.method = 'POST'

    mockSession.mockImplementation(() => true)

    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ id: 'id' })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('test')
    })
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('PUT', async () => {
    req.method = 'PUT'
    req.body = {
      workspace: {},
      data: []
    }

    mockSession.mockImplementation(() => true)

    // Not authorized
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'Access denied' })

    // Authorized
    mockAuth.mockImplementation(() => true)
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('test')
    })
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAuth).toHaveBeenCalledTimes(3)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('DELETE', async () => {
    req.method = 'DELETE'
    req.body = {}

    mockSession.mockImplementation(() => true)

    // Not authorized
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'Access denied' })

    // Authorized
    mockAuth.mockImplementation(() => true)
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('test')
    })
    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAuth).toHaveBeenCalledTimes(3)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await workspace(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
