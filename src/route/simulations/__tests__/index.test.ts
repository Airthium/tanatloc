import { IRequest, IResponse, IRouteError } from '@/route'
import ids from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockCheckProjectAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkProjectAuth: async () => mockCheckProjectAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockGet = jest.fn()
jest.mock('@/lib/simulation', () => ({
  get: async () => mockGet()
}))

describe('route/simulations/ids', () => {
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

    mockCheckProjectAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockGet.mockReset()
    mockGet.mockImplementation(() => ({
      id: 'id',
      name: 'name'
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
    await ids(
      {
        ...req,
        body: {
          ids: ['id1']
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
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
    await ids(
      {
        ...req,
        //@ts-ignore
        body: undefined
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { ids(?array) })'
    })

    // No geometries
    await ids(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ simulations: [] })

    // Normal

    mockGet.mockImplementationOnce(() => {
      // Empty mock
    })
    mockCheckProjectAuth.mockImplementationOnce(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })
    await ids(
      {
        ...req,
        body: {
          ids: ['id1', 'id2', 'id3']
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      simulations: [{ id: 'id', name: 'name' }]
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await ids(
      {
        ...req,
        body: {
          ids: ['id1']
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
