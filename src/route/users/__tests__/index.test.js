import users from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockGet = jest.fn()
const mockGetAll = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async () => mockGet(),
  getAll: async () => mockGetAll()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('src/route/users', () => {
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

    mockGet.mockReset()
    mockGetAll.mockReset()

    mockError.mockReset()

    req = {
      method: 'GET'
    }
    response = undefined
  })

  it('no session', async () => {
    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetAll).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('no superuser', async () => {
    mockSession.mockImplementation(() => 'id')
    mockGet.mockImplementation(() => ({
      superuser: false
    }))
    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGetAll).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ error: true, message: 'Unauthorized' })
  })

  it('GET', async () => {
    req.method = 'GET'

    mockSession.mockImplementation(() => 'id')
    mockGet.mockImplementation(() => ({
      superuser: true
    }))
    mockGet.mockImplementation(() => ({
      superuser: true
    }))
    mockGetAll.mockImplementation(() => [
      {
        id: 'id'
      }
    ])

    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ users: [{ id: 'id' }] })

    // Error
    mockGetAll.mockImplementation(() => {
      throw new Error('test')
    })
    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGetAll).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)
    mockGet.mockImplementation(() => ({
      superuser: true
    }))

    await users(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGetAll).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
