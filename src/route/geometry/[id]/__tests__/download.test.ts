import { IRequest, IResponse, IRouteError } from '@/route'
import download from '../download'

const mockSession = jest.fn()
jest.mock('../../../session', () => ({
  session: () => mockSession()
}))

const mockCheckGeometryAuth = jest.fn()
jest.mock('../../../auth', () => ({
  checkGeometryAuth: async () => mockCheckGeometryAuth()
}))

const mockError = jest.fn()
jest.mock('../../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockRead = jest.fn()
jest.mock('@/lib/geometry', () => ({
  read: async () => mockRead()
}))

describe('route/geometry/[id]/download', () => {
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

    mockCheckGeometryAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockRead.mockReset()
    mockRead.mockImplementation(() => 'read')

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(0)
    expect(mockRead).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  test('no id', async () => {
    req.method = 'GET'
    req.query = {}
    req.params = {}

    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(0)
    expect(mockRead).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
  })

  test('access denied', async () => {
    req.query = { id: 'id' }
    req.params = {}

    mockCheckGeometryAuth.mockImplementation(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })

    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockRead).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
  })

  test('read', async () => {
    req.method = 'GET'
    req.query = {}
    req.params = { id: 'id' }

    // Normal
    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockRead).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('read')

    // Error
    mockRead.mockImplementation(() => {
      throw new Error('Read error')
    })
    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(2)
    expect(mockRead).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Read error' })
  })

  test('wrong method', async () => {
    req.method = 'method'
    req.query = { id: 'id' }
    req.params = {}

    await download(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockRead).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
