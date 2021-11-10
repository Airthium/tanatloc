import archive from '../archive'

const mockSession = jest.fn()
jest.mock('../../../session', () => () => mockSession())

const mockCheckProjectAuth = jest.fn()
jest.mock('../../../auth', () => ({
  checkProjectAuth: async () => mockCheckProjectAuth()
}))

const mockError = jest.fn()
jest.mock(
  '../../../error',
  () => (status, message) => mockError(status, message)
)

const mockArchive = jest.fn()
jest.mock('@/lib/project', () => ({
  archive: async () => mockArchive()
}))

describe('route/project/[id]', () => {
  const req = {}
  let resStatus
  let resJson
  const res = {
    setHeader: jest.fn(),
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

    mockCheckProjectAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockArchive.mockReset()
    mockArchive.mockImplementation(() => ({
      pipe: jest.fn()
    }))

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockArchive).toHaveBeenCalledTimes(0)
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

    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockArchive).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
  })

  test('Access denied', async () => {
    req.query = {}
    req.params = { id: 'id' }

    mockCheckProjectAuth.mockImplementation(() => {
      const error = new Error('Access denied')
      error.status = 403
      throw error
    })

    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockArchive).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
  })

  test('GET', async () => {
    req.method = 'GET'
    req.query = { id: 'id' }
    req.params = {}

    // Normal
    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockArchive).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockArchive.mockImplementation(() => {
      throw new Error('Get error')
    })
    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(2)
    expect(mockArchive).toHaveBeenCalledTimes(2)
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

    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockArchive).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
