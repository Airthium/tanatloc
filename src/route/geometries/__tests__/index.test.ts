import { IRequest, IResponse, IRouteError } from '@/route'
import geometries from '..'

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
jest.mock('@/lib/geometry', () => ({
  get: async (id: string) => mockGet(id)
}))

describe('route/geometries/geometries', () => {
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

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await geometries({ ...req, body: { ids: ['id'] } }, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    await geometries(
      //@ts-ignore
      req,
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
    await geometries(
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
    expect(resJson).toEqual({ geometries: [] })

    // Normal
    mockGet.mockImplementation((id) => {
      if (id === 'id1') return
      return {
        id: id,
        name: 'name'
      }
    })
    mockCheckProjectAuth.mockImplementationOnce(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })
    await geometries(
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
      geometries: [{ id: 'id3', name: 'name' }]
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await geometries({ ...req, body: { ids: ['id1'] } }, res)
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
