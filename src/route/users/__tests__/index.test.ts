import { IRequest, IResponse, IRouteError } from '@/route'
import users from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockGet = jest.fn()
const mockGetAll = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async () => mockGet(),
  getAll: async () => mockGetAll()
}))

describe('route/users', () => {
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

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockGet.mockReset()
    mockGetAll.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetAll).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('no superuser', async () => {
    mockGet.mockImplementation(() => ({}))
    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGetAll).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({ error: true, message: 'Access denied' })
  })

  test('GET', async () => {
    req.method = 'GET'

    mockGet.mockImplementation(() => ({
      superuser: true
    }))
    mockGetAll.mockImplementation(() => [
      {
        id: 'id'
      }
    ])

    // Normal
    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ users: [{ id: 'id' }] })

    // Error
    mockGetAll.mockImplementation(() => {
      throw new Error('Get error')
    })
    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGetAll).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Get error' })
  })

  test('wrong method', async () => {
    req.method = 'method'

    mockGet.mockImplementation(() => ({
      superuser: true
    }))

    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGetAll).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
