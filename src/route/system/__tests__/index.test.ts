import { IRequest, IResponse, IRouteError } from '@/route'
import system from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockUserGet = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async () => mockUserGet()
}))

const mockGet = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/lib/system', () => ({
  get: async () => mockGet(),
  update: async () => mockUpdate()
}))

describe('route/system', () => {
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

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockUserGet.mockReset()

    mockGet.mockReset()
    mockUpdate.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('GET', async () => {
    req.method = 'GET'

    // Normal
    mockGet.mockImplementation(() => ({ item: 'item' }))
    await system(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ system: { item: 'item' } })

    // Error
    mockGet.mockImplementation(() => {
      throw new Error('Get error')
    })
    await system(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Get error' })
  })

  test('PUT', async () => {
    req.method = 'PUT'

    // No session
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await system(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })

    // No superuser
    mockSession.mockReset()
    mockUserGet.mockImplementation(() => ({}))
    await system(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({ error: true, message: 'Access denied' })

    // Wrong body
    mockUserGet.mockImplementation(() => ({ superuser: true }))
    await system(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body(array))'
    })

    // Normal
    await system(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockUserGet).toHaveBeenCalledTimes(3)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    await system(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockUserGet).toHaveBeenCalledTimes(4)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(3)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Update error' })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await system(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
