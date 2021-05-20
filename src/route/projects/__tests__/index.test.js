import ids from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => async () => mockSession())

const mockAuth = jest.fn()
jest.mock('../../auth', () => async () => mockAuth())

const mockGet = jest.fn()
jest.mock('@/lib/project', () => ({
  get: async () => mockGet()
}))

const mockGetWorkspace = jest.fn()
jest.mock('@/lib/workspace', () => ({
  get: async () => mockGetWorkspace()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/projects/ids', () => {
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

    mockGet.mockReset()
    mockGet.mockImplementation(() => ({
      id: 'id',
      title: 'title'
    }))

    mockGetWorkspace.mockReset()
    mockGetWorkspace.mockImplementation(() => ({}))

    mockError.mockReset()

    req = {
      method: 'POST',
      body: { ids: ['id1', 'id2'] }
    }
    response = undefined
  })

  it('no session', async () => {
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetWorkspace).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('POST', async () => {
    mockSession.mockImplementation(() => 'id')

    // No ids
    req.body.ids = undefined
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetWorkspace).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ projects: [] })

    // No authorization
    req.body.ids = ['id1', 'id2']
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGetWorkspace).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ projects: [] })

    // Normal
    mockAuth.mockImplementation(() => true)
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAuth).toHaveBeenCalledTimes(4)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockGetWorkspace).toHaveBeenCalledTimes(4)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      projects: [
        { id: 'id', title: 'title' },
        { id: 'id', title: 'title' }
      ]
    })

    // get error
    mockGet.mockImplementation(() => {
      throw new Error('test')
    })
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockAuth).toHaveBeenCalledTimes(4)
    expect(mockGet).toHaveBeenCalledTimes(6)
    expect(mockGetWorkspace).toHaveBeenCalledTimes(4)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ projects: [] })

    // Error
    req.body = undefined
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(5)
    expect(mockAuth).toHaveBeenCalledTimes(4)
    expect(mockGet).toHaveBeenCalledTimes(6)
    expect(mockGetWorkspace).toHaveBeenCalledTimes(4)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: "Cannot read property 'ids' of undefined"
    })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetWorkspace).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
