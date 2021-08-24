import run from '../run'

const mockSession = jest.fn()
jest.mock('../../../session', () => () => mockSession())

const mockCheckSimulationAuth = jest.fn()
jest.mock('../../../auth', () => ({
  checkSimulationAuth: async () => mockCheckSimulationAuth()
}))

const mockError = jest.fn()
jest.mock(
  '../../../error',
  () => (status, message) => mockError(status, message)
)

const mockRun = jest.fn()
jest.mock('@/lib/simulation', () => ({
  run: async () => mockRun()
}))

describe('route/simulation/[id]/run', () => {
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

    mockCheckSimulationAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockRun.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockRun).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('no id', async () => {
    req.query = {}
    req.params = {}

    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockRun).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
  })

  test('Access denied', async () => {
    req.query = { id: 'id' }
    req.params = {}

    mockCheckSimulationAuth.mockImplementation(() => {
      const error = new Error('Access denied')
      error.status = 403
      throw error
    })

    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(1)
    expect(mockRun).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
  })

  test('GET', async () => {
    req.method = 'GET'
    req.query = {}
    req.params = { id: 'id' }

    // Normal
    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(1)
    expect(mockRun).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      ok: true
    })

    // Error
    mockRun.mockImplementation(() => {
      throw new Error('Run error')
    })
    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(2)
    expect(mockRun).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Run error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'
    req.query = { id: 'id' }

    await run(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(1)
    expect(mockRun).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
