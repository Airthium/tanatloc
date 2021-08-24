import organizations from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockGetByUser = jest.fn()
jest.mock('@/lib/organization', () => ({
  getByUser: async () => mockGetByUser()
}))

describe('route/groups', () => {
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

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockGetByUser.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await organizations(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('GET', async () => {
    req.method = 'GET'

    // Normal
    mockGetByUser.mockImplementation(() => [])
    await organizations(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      organizations: []
    })

    // Error
    mockGetByUser.mockImplementation(() => {
      throw new Error('Get error')
    })
    await organizations(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGetByUser).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await organizations(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
