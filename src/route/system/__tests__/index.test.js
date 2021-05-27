import system from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockUserGet = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async () => mockUserGet()
}))

const mockGet = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/lib/system', () => ({
  get: async () => mockGet(),
  update: async () => mockUpdate()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/system', () => {
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

    mockUserGet.mockReset()

    mockGet.mockReset()
    mockUpdate.mockReset()

    mockError.mockReset()

    req = {
      method: 'GET'
    }
    response = undefined
  })

  test('GET', async () => {
    // Normal
    mockGet.mockImplementation(() => ({ item: 'item' }))
    await system(req, res)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ system: { item: 'item' } })

    // Error
    mockGet.mockImplementation(() => {
      throw new Error()
    })
    await system(req, res)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
  })

  // test('no session', async () => {
  //   await system(req, res)
  //   expect(mockSession).toHaveBeenCalledTimes(1)
  //   expect(mockUserGet).toHaveBeenCalledTimes(0)
  //   expect(mockGet).toHaveBeenCalledTimes(0)
  //   expect(mockUpdate).toHaveBeenCalledTimes(0)
  //   expect(mockError).toHaveBeenCalledTimes(0)
  //   expect(response).toBe(undefined)
  // })

  // test('no superuser', async () => {
  //   mockSession.mockImplementation(() => 'id')
  //   mockUserGet.mockImplementation(() => ({
  //     superuser: false
  //   }))
  //   await system(req, res)
  //   expect(mockSession).toHaveBeenCalledTimes(1)
  //   expect(mockUserGet).toHaveBeenCalledTimes(1)
  //   expect(mockGet).toHaveBeenCalledTimes(0)
  //   expect(mockUpdate).toHaveBeenCalledTimes(0)
  //   expect(mockError).toHaveBeenCalledTimes(0)
  //   expect(response).toEqual({ error: true, message: 'Unauthorized' })
  // })

  test('PUT', async () => {
    req.method = 'PUT'

    // No session
    await system(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)

    // No supersuer
    mockSession.mockImplementation(() => 'id')
    mockUserGet.mockImplementation(() => ({}))

    await system(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ error: true, message: 'Unauthorized' })

    // Normal
    mockSession.mockImplementation(() => 'id')
    mockUserGet.mockImplementation(() => ({
      superuser: true
    }))

    await system(req, res)
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('test')
    })
    await system(req, res)
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockUserGet).toHaveBeenCalledTimes(3)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  test('wrong method', async () => {
    req.method = 'SOMETHING'

    await system(req, res)
    expect(mockSession).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
