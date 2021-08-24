import result from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockCheckSimulationAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkSimulationAuth: async () => mockCheckSimulationAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockLoad = jest.fn()
jest.mock('@/lib/result', () => ({
  load: async () => mockLoad()
}))

describe('route/result', () => {
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

    mockCheckSimulationAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockLoad.mockReset()
    mockLoad.mockImplementation(() => ({
      buffer: 'buffer'
    }))

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockLoad).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    req.body = {}
    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockLoad).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), glb(string) } }'
    })

    // Access denied
    req.body = {
      simulation: { id: 'id' },
      result: { originPath: 'path', glb: 'glb' }
    }
    mockCheckSimulationAuth.mockImplementation(() => {
      const error = new Error('Access denied')
      error.status = 403
      throw error
    })
    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(1)
    expect(mockLoad).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockCheckSimulationAuth.mockImplementation(() => {
      // Empty
    })
    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(2)
    expect(mockLoad).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      buffer: 'buffer'
    })

    // Error
    mockLoad.mockImplementation(() => {
      throw new Error('Load error')
    })
    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(3)
    expect(mockLoad).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Load error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockLoad).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
