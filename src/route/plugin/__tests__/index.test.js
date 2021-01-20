import plugin from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockGetByUser = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/lib/plugin', () => ({
  getByUser: async () => mockGetByUser(),
  update: async () => mockUpdate()
}))

const mockSentry = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockSentry()
}))

describe('src/route/plugin', () => {
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

    mockGetByUser.mockReset()
    mockGetByUser.mockImplementation(() => [])
    mockUpdate.mockReset()

    mockSentry.mockReset()

    req = { method: 'GET' }
    response = undefined
  })

  it('no session', async () => {
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    mockSession.mockImplementation(() => true)

    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ plugins: [] })

    // Error
    mockGetByUser.mockImplementation(() => {
      throw new Error()
    })
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGetByUser).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: '' })
  })

  it('PUT', async () => {
    mockSession.mockImplementation(() => true)
    req.method = 'PUT'

    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: '' })
  })

  it('wrong method', async () => {
    mockSession.mockImplementation(() => true)
    req.method = 'SOMETHING'

    await plugin(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGetByUser).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
