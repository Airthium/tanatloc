import { IRequest, IResponse, IRouteError } from '@/route'
import result from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockCheckSimulationAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkSimulationAuth: async () => mockCheckSimulationAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockLoad = jest.fn()
jest.mock('@/lib/result', () => ({
  load: async () => mockLoad()
}))

describe('route/result', () => {
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
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await result(
      {
        ...req,
        body: {
          simulation: {
            id: 'id'
          },
          result: {
            originPath: 'originPath',
            glb: 'glb'
          }
        }
      },
      res
    )
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
    await result(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
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
    mockCheckSimulationAuth.mockImplementation(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })
    await result(
      {
        ...req,
        body: {
          simulation: {
            id: 'id'
          },
          result: {
            originPath: 'originPath',
            glb: 'glb'
          }
        }
      },
      res
    )
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
    await result(
      {
        ...req,
        body: {
          simulation: {
            id: 'id'
          },
          result: {
            originPath: 'originPath',
            glb: 'glb'
          }
        }
      },
      res
    )
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
    await result(
      {
        ...req,
        body: {
          simulation: {
            id: 'id'
          },
          result: {
            originPath: 'originPath',
            glb: 'glb'
          }
        }
      },
      res
    )
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

    await result(
      {
        ...req,
        body: {
          simulation: {
            id: 'id'
          },
          result: {
            originPath: 'originPath',
            glb: 'glb'
          }
        }
      },
      res
    )
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
