import user from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('../../../lib/user', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

const mockSentry = jest.fn()
jest.mock('../../../lib/sentry', () => ({
  captureException: () => mockSentry()
}))

describe('src/route/user', () => {
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

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockGet.mockReset()
    mockGet.mockImplementation(() => ({
      username: 'username'
    }))
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockSentry.mockReset()

    req = {
      method: 'GET'
    }
    response = undefined
  })

  it('no session', async () => {
    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('GET', async () => {
    mockSession.mockImplementation(() => 'id')

    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      user: {
        username: 'username'
      }
    })

    // Error
    mockGet.mockImplementation(() => {
      throw new Error('test')
    })
    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('POST', async () => {
    req.method = 'POST'

    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      id: 'id'
    })

    // // Error
    mockAdd.mockImplementation(() => {
      throw new Error('test')
    })
    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('PUT', async () => {
    req.method = 'PUT'

    mockSession.mockImplementation(() => true)

    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('test')
    })
    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('DELETE', async () => {
    req.method = 'DELETE'

    mockSession.mockImplementation(() => true)

    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('test')
    })
    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)

    await user(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'Method SOMETHING not allowed' })
  })
})
