import log from '../log'

const mockSession = jest.fn()
jest.mock('../../../session', () => () => mockSession())

const mockAuth = jest.fn()
jest.mock('../../../auth', () => () => mockAuth())

const mockSimulationGet = jest.fn()
const mockSimulationGetLog = jest.fn()
jest.mock('@/lib/simulation', () => ({
  get: async () => mockSimulationGet(),
  getLog: async () => mockSimulationGetLog()
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

describe('route/simulation/[id]/log', () => {
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
    mockSimulationGetLog.mockReset()
    mockSimulationGetLog.mockImplementation(() => 'log')

    mockProjectGet.mockReset()
    mockProjectGet.mockImplementation(() => ({}))

    mockWorkspaceGet.mockReset()

    mockError.mockReset()

    req = {
      method: 'POST',
      query: { id: 'id' },
      body: { file: 'log' }
    }
    response = undefined
  })

  test('no session', async () => {
    await log(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockSimulationGet).toHaveBeenCalledTimes(0)
    expect(mockSimulationGetLog).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
  })

  test('no authorization', async () => {
    mockSession.mockImplementation(() => 'id')
    mockSimulationGet.mockImplementation(() => ({}))

    await log(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockSimulationGet).toHaveBeenCalledTimes(1)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockSimulationGetLog).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ error: true, message: 'Unauthorized' })

    // Error
    mockAuth.mockImplementation(() => {
      throw new Error('test')
    })
    await log(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockSimulationGet).toHaveBeenCalledTimes(2)
    expect(mockSimulationGetLog).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('electron', async () => {
    req.query.id = undefined
    req.params = { id: 'id' }

    mockSession.mockImplementation(() => true)
    mockSimulationGet.mockImplementation(() => ({}))
    mockAuth.mockImplementation(() => true)

    await log(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockSimulationGet).toHaveBeenCalledTimes(1)
    expect(mockSimulationGetLog).toHaveBeenCalledTimes(1)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ log: 'log' })

    // Run error
    mockSimulationGetLog.mockImplementation(() => {
      throw new Error('test')
    })
    await log(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockSimulationGet).toHaveBeenCalledTimes(2)
    expect(mockSimulationGetLog).toHaveBeenCalledTimes(2)
    expect(mockProjectGet).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)
    mockSimulationGet.mockImplementation(() => ({}))
    mockAuth.mockImplementation(() => true)

    await log(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockSimulationGet).toHaveBeenCalledTimes(1)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
