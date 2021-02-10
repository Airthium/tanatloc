import ids from '../[ids]'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockAuth = jest.fn()
jest.mock('../../auth', () => () => mockAuth())

const mockGet = jest.fn()
jest.mock('@/lib/simulation', () => ({
  get: async () => mockGet()
}))

const mockGetProject = jest.fn()
jest.mock('@/lib/project', () => ({
  get: async () => mockGetProject()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('src/route/projects/ids', () => {
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
      name: 'name'
    }))

    mockGetProject.mockReset()

    mockError.mockReset()

    req = {
      method: 'GET',
      query: { ids: 'id1&id2' }
    }
    response = undefined
  })

  it('no session', async () => {
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('electron', async () => {
    mockSession.mockImplementation(() => true)
    mockAuth.mockImplementation(() => true)

    req.query = {}
    req.params = { ids: 'id1&id2' }

    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGetProject).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      simulations: [
        { id: 'id', name: 'name' },
        { id: 'id', name: 'name' }
      ]
    })
  })

  it('GET', async () => {
    mockSession.mockImplementation(() => 'id')

    // No ids
    req.query.ids = 'undefined'
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ simulations: [] })

    // No authorization
    req.query.ids = 'id1&id2'
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGetProject).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ simulations: [] })

    // Normal
    mockAuth.mockImplementation(() => true)
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAuth).toHaveBeenCalledTimes(4)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockGetProject).toHaveBeenCalledTimes(4)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      simulations: [
        { id: 'id', name: 'name' },
        { id: 'id', name: 'name' }
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
    expect(mockGetProject).toHaveBeenCalledTimes(4)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ simulations: [] })

    // Error
    req.query = {}
    await ids(req, res)
    expect(mockSession).toHaveBeenCalledTimes(5)
    expect(mockAuth).toHaveBeenCalledTimes(4)
    expect(mockGet).toHaveBeenCalledTimes(6)
    expect(mockGetProject).toHaveBeenCalledTimes(4)
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
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
