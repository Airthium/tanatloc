import plugins from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockUserGet = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async () => mockUserGet()
}))

const mockClientList = jest.fn()
jest.mock('@/lib/plugins', () => ({
  clientList: async () => mockClientList()
}))

describe('route/plugins', () => {
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

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockUserGet.mockReset()
    mockUserGet.mockImplementation(() => ({}))

    mockClientList.mockReset()
    mockClientList.mockImplementation(() => ['plugin'])

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await plugins(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockClientList).toHaveBeenCalledTimes(0)
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
    await plugins(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockClientList).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual(['plugin'])

    // Error
    mockClientList.mockImplementation(() => {
      throw new Error('clientList error')
    })
    await plugins(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockClientList).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'clientList error'
    })
  })

  test('POST', async () => {
    req.method = 'POST'

    // Normal
    await plugins(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockClientList).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual(['plugin'])

    // Error
    mockClientList.mockImplementation(() => {
      throw new Error('clientList error')
    })
    await plugins(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockClientList).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'clientList error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await plugins(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockClientList).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
