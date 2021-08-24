import simulation from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockCheckProjectAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkProjectAuth: async () => mockCheckProjectAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockAdd = jest.fn()
jest.mock('@/lib/simulation', () => ({
  add: async () => mockAdd()
}))

describe('route/simulation', () => {
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

    mockCheckProjectAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id',
      name: 'name'
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
    await simulation(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('GET', async () => {
    req.method = 'GET'

    await simulation(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    req.body = {}
    await simulation(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, simulation: { name(string), scheme(object) } }'
    })

    // Access denied
    req.body = {
      project: { id: 'id' },
      simulation: { name: 'name', scheme: {} }
    }
    mockCheckProjectAuth.mockImplementation(() => {
      const error = new Error('Access denied')
      error.status = 403
      throw error
    })
    await simulation(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockCheckProjectAuth.mockImplementation(() => {
      // Empty
    })
    await simulation(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      id: 'id',
      name: 'name'
    })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('Add error')
    })
    await simulation(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Add error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await simulation(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
