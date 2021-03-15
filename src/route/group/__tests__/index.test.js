import group from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockUserGet = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async () => mockUserGet()
}))

const mockAdd = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/group', () => ({
  add: async () => mockAdd(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/group', () => {
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
    mockUserGet.mockImplementation(() => ({}))

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockError.mockReset()

    req = {
      method: 'POST'
    }
    response = undefined
  })

  it('no session', async () => {
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('no superuser', async () => {
    mockSession.mockImplementation(() => 'id')

    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ error: true, message: 'Unauthorized' })
  })

  it('POST', async () => {
    mockSession.mockImplementation(() => 'id')
    mockUserGet.mockImplementation(() => ({
      superuser: true
    }))

    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ id: 'id' })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('test')
    })
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('PUT', async () => {
    req.method = 'PUT'
    req.body = {
      id: 'id',
      data: []
    }

    mockSession.mockImplementation(() => true)
    mockUserGet.mockImplementation(() => ({
      superuser: true
    }))

    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('test')
    })
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('DELETE', async () => {
    req.method = 'DELETE'

    mockSession.mockImplementation(() => true)
    mockUserGet.mockImplementation(() => ({
      superuser: true
    }))

    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('test')
    })
    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)
    mockUserGet.mockImplementation(() => ({
      superuser: true
    }))

    await group(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
