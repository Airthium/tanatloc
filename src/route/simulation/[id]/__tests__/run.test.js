import run from '../run'

const mockSession = jest.fn()
jest.mock('../../../session', () => () => mockSession())

const mockAuth = jest.fn()
jest.mock('../../../auth', () => () => mockAuth())

const mockSimulationGet = jest.fn()
const mockSimulationRun = jest.fn()
jest.mock('@/lib/simulation', () => ({
  get: async () => mockSimulationGet(),
  run: async () => mockSimulationRun()
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

describe('src/route/simulation/[id]/run', () => {
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

    mockSimulationGet.mockReset()
    mockSimulationRun.mockReset()

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

  it('no session', async () => {
    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockSimulationGet).toHaveBeenCalledTimes(0)
    expect(mockSimulationRun).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
  })

  it('no authorization', async () => {
    mockSession.mockImplementation(() => 'id')
    mockSimulationGet.mockImplementation(() => ({}))

    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockSimulationGet).toHaveBeenCalledTimes(1)
    expect(mockSimulationRun).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ error: true, message: 'Unauthorized' })

    // Error
    mockAuth.mockImplementation(() => {
      throw new Error('test')
    })
    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockSimulationGet).toHaveBeenCalledTimes(2)
    expect(mockSimulationRun).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('electron', async () => {
    req.query.id = undefined
    req.params = { id: 'id' }

    mockSession.mockImplementation(() => true)
    mockSimulationGet.mockImplementation(() => ({}))
    mockAuth.mockImplementation(() => true)

    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockSimulationGet).toHaveBeenCalledTimes(1)
    expect(mockSimulationRun).toHaveBeenCalledTimes(1)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ ok: true })

    // Run error
    mockSimulationRun.mockImplementation(() => {
      throw new Error('test')
    })
    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockSimulationGet).toHaveBeenCalledTimes(2)
    expect(mockSimulationRun).toHaveBeenCalledTimes(2)
    expect(mockProjectGet).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)
    mockSimulationGet.mockImplementation(() => ({}))
    mockAuth.mockImplementation(() => true)

    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockSimulationGet).toHaveBeenCalledTimes(1)
    expect(mockSimulationRun).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
