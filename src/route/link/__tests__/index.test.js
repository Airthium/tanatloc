import link from '..'

const mockError = jest.fn()
jest.mock('../../error', () => (status, message) => mockError(status, message))

const mockGet = jest.fn()
const mockProcess = jest.fn()
jest.mock('@/lib/link', () => ({
  get: async () => mockGet(),
  process: async () => mockProcess()
}))

describe('route/link', () => {
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
    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockGet.mockReset()
    mockProcess.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    req.body = {}
    await link(req, res)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid), data(array) })'
    })

    // Normal
    req.body = {
      id: 'id',
      data: []
    }
    mockGet.mockImplementation(() => ({}))
    await link(req, res)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({})

    // Error
    mockGet.mockImplementation(() => {
      throw new Error('Get error')
    })
    await link(req, res)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get error'
    })
  })

  test('PUT', async () => {
    req.method = 'PUT'

    // Wrong body
    req.body = {}
    await link(req, res)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { id(uuid), data(?object) })'
    })

    // Normal
    req.body = {
      id: 'id'
    }
    await link(req, res)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockProcess.mockImplementation(() => {
      throw new Error('Process error')
    })
    await link(req, res)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Process error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await link(req, res)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
