import { IRequest, IResponse, IRouteError } from '@/route'
import stop from '../stop'

const mockSession = jest.fn()
jest.mock('../../../session', () => ({
  session: () => mockSession()
}))

const mockCheckSimulationAuth = jest.fn()
jest.mock('../../../auth', () => ({
  checkSimulationAuth: async () => mockCheckSimulationAuth()
}))

const mockError = jest.fn()
jest.mock('../../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockStop = jest.fn()
jest.mock('@/lib/simulation', () => ({
  stop: async () => mockStop()
}))

describe('route/simulation/[id]/stop', () => {
  const req: IRequest = {}
  let resStatus: number
  let resJson: any
  const res: IResponse = {
    setHeader: jest.fn,
    status: (status: number) => {
      resStatus = status
      return res
    },
    end: () => {
      resJson = 'end'
      return res
    },
    json: (value: object) => {
      resJson = value
      return res
    }
  }

  beforeEach(() => {
    mockSession.mockReset()

    mockCheckSimulationAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockStop.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await stop(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockStop).toHaveBeenCalledTimes(0)
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

    await stop(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockStop).toHaveBeenCalledTimes(0)
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
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })

    await stop(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(1)
    expect(mockStop).toHaveBeenCalledTimes(0)
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
    await stop(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(1)
    expect(mockStop).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockStop.mockImplementation(() => {
      throw new Error('Run error')
    })
    await stop(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(2)
    expect(mockStop).toHaveBeenCalledTimes(2)
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

    await stop(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(1)
    expect(mockStop).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
