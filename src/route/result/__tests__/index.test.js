import result from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockLoad = jest.fn()
jest.mock('@/lib/result', () => ({
  load: async () => mockLoad()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/result', () => {
  let req, response
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      },
      end: () => {
        response = 'end'
      }
    })
  }

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockLoad.mockReset()
    mockLoad.mockImplementation(() => ({
      buffer: 'buffer'
    }))

    mockError.mockReset()

    req = {
      method: 'POST'
    }
    response = undefined
  })

  test('no session', async () => {
    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLoad).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  test('POST', async () => {
    mockSession.mockImplementation(() => 'id')

    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLoad).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      buffer: 'buffer'
    })

    // Error
    mockLoad.mockImplementation(() => {
      throw new Error('test')
    })
    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockLoad).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await result(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLoad).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
