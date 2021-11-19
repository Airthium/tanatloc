import { IRequest, IResponse, IRouteError } from '@/route'
import groups from '../[id]'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockCheckOrganizationAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkOrganizationAuth: async () => mockCheckOrganizationAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockGetByOrganization = jest.fn()
jest.mock('@/lib/group', () => ({
  getByOrganization: async () => mockGetByOrganization()
}))

describe('route/groups/[id]', () => {
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

    mockCheckOrganizationAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockGetByOrganization.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckOrganizationAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('no id', async () => {
    req.method = 'GET'
    req.query = {}
    req.params = {}

    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckOrganizationAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
  })

  test('GET', async () => {
    req.method = 'GET'
    req.query = {}
    req.params = { id: 'id' }

    // Access denied
    mockCheckOrganizationAuth.mockImplementation(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })
    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckOrganizationAuth).toHaveBeenCalledTimes(1)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockCheckOrganizationAuth.mockImplementation(() => {
      // Empty
    })
    mockGetByOrganization.mockImplementation(() => [])
    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckOrganizationAuth).toHaveBeenCalledTimes(2)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      groups: []
    })

    // Error
    mockGetByOrganization.mockImplementation(() => {
      throw new Error('Get error')
    })
    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckOrganizationAuth).toHaveBeenCalledTimes(3)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'
    req.query = { id: 'id' }
    req.params = {}

    await groups(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckOrganizationAuth).toHaveBeenCalledTimes(0)
    expect(mockGetByOrganization).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
