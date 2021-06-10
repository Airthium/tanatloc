import part from '../part'

const mockSession = jest.fn()
jest.mock('../../../session', () => () => mockSession())

const mockAuth = jest.fn()
jest.mock('../../../auth', () => () => mockAuth())

const mockGet = jest.fn()
const mockRead = jest.fn()
jest.mock('@/lib/geometry', () => ({
  get: async () => mockGet(),
  read: async () => mockRead()
}))

const mockProjectGet = jest.fn()
jest.mock('@/lib/project', () => ({
  get: async () => mockProjectGet()
}))

const mockWorkspaceGet = jest.fn()
jest.mock('@/lib/workspace', () => ({
  get: async () => mockWorkspaceGet()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/geometry/[id]/part', () => {
  let req, response
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      }
    })
  }

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockAuth.mockReset()
    mockAuth.mockImplementation(() => false)

    mockGet.mockReset()
    mockRead.mockReset()

    mockProjectGet.mockReset()
    mockProjectGet.mockImplementation(() => ({}))

    mockWorkspaceGet.mockReset()

    mockError.mockReset()

    req = {
      method: 'GET',
      query: { id: 'id' }
    }
    response = undefined
  })

  test('no session', async () => {
    await part(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockRead).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
  })

  test('no authorization', async () => {
    mockSession.mockImplementation(() => 'id')
    mockGet.mockImplementation(() => ({}))

    await part(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockRead).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ error: true, message: 'Unauthorized' })

    // Error
    mockAuth.mockImplementation(() => {
      throw new Error('test')
    })
    await part(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockRead).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('electron', async () => {
    req.query.id = undefined
    req.params = { id: 'id' }

    mockSession.mockImplementation(() => true)
    mockGet.mockImplementation(() => ({}))
    mockAuth.mockImplementation(() => true)

    await part(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockRead).toHaveBeenCalledTimes(1)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe()

    // part error
    mockRead.mockImplementation(() => {
      throw new Error('test')
    })
    await part(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockRead).toHaveBeenCalledTimes(2)
    expect(mockProjectGet).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)
    mockGet.mockImplementation(() => ({}))
    mockAuth.mockImplementation(() => true)

    await part(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockRead).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
