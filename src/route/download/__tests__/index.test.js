import download from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockAuth = jest.fn()
jest.mock('../../auth', () => () => mockAuth())

const mockCreateStream = jest.fn()
jest.mock('@/lib/file', () => ({
  createStream: () => mockCreateStream()
}))

const mockGetSimulation = jest.fn()
jest.mock('@/lib/simulation', () => ({
  get: async () => mockGetSimulation()
}))

const mockGetProject = jest.fn()
jest.mock('@/lib/project', () => ({
  get: async () => mockGetProject()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('src/route/download', () => {
  let req, response
  const res = {
    setHeader: () => {},
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

    mockCreateStream.mockReset()
    mockCreateStream.mockImplementation(() => ({
      pipe: () => {
        response = 'pipe'
      }
    }))

    mockGetSimulation.mockReset()
    mockGetSimulation.mockImplementation(() => ({
      project: {}
    }))

    mockGetProject.mockReset()

    mockError.mockReset()

    req = {
      method: 'POST',
      body: {}
    }
    response = undefined
  })

  it('no session', async () => {
    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetSimulation).toHaveBeenCalledTimes(0)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockCreateStream).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('POST', async () => {
    req.body = {
      simulation: {},
      file: {}
    }

    mockSession.mockImplementation(() => 'id')

    // Not authorized
    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetSimulation).toHaveBeenCalledTimes(1)
    expect(mockGetProject).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockCreateStream).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ error: true, message: 'Unauthorized' })

    // Authorized
    mockAuth.mockImplementation(() => true)
    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGetSimulation).toHaveBeenCalledTimes(2)
    expect(mockGetProject).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockCreateStream).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe('pipe')

    // Error
    mockCreateStream.mockImplementation(() => {
      throw new Error('test')
    })
    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockGetSimulation).toHaveBeenCalledTimes(3)
    expect(mockGetProject).toHaveBeenCalledTimes(3)
    expect(mockAuth).toHaveBeenCalledTimes(3)
    expect(mockCreateStream).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => 'id')

    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetSimulation).toHaveBeenCalledTimes(0)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockCreateStream).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
