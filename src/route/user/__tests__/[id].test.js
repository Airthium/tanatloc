import id from '../[id]'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async (id, data) => mockGet(id, data),
  update: async () => mockUpdate(),
  del: () => mockDel()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/user/[id]', () => {
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
    mockGet.mockImplementation(() => ({
      id: 'id',
      name: 'name'
    }))
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockError.mockReset()

    req = {
      method: 'GET',
      query: { id: 'id' }
    }
    response = undefined
  })

  it('no session', async () => {
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('no superuser', async () => {
    mockSession.mockImplementation(() => 'id')
    mockGet.mockImplementation(() => ({ superuser: false }))

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ error: true, message: 'Unauthorized' })
  })

  it('electron', async () => {
    req.query.id = undefined
    req.params = { id: 'id' }

    mockSession.mockImplementation(() => true)
    mockGet.mockImplementation(() => ({ superuser: true, id: 'id' }))

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      user: {
        id: 'id',
        superuser: true
      }
    })
  })

  it('GET', async () => {
    mockSession.mockImplementation(() => true)
    mockGet.mockImplementation(() => ({ superuser: true, id: 'id' }))

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      user: {
        id: 'id',
        superuser: true
      }
    })

    // Error
    mockGet.mockImplementation((id, data) => {
      if (data.includes('firstname')) throw new Error('test')
      return { superuser: true }
    })
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('PUT', async () => {
    req.method = 'PUT'

    mockSession.mockImplementation(() => true)
    mockGet.mockImplementation(() => ({ superuser: true }))

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('test')
    })
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('DELETE', async () => {
    req.method = 'DELETE'

    mockSession.mockImplementation(() => true)
    mockGet.mockImplementation(() => ({ superuser: true }))

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('test')
    })
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ error: true, message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)
    mockGet.mockImplementation(() => ({ superuser: true }))

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(response).toEqual({
      error: true,
      message: 'Method SOMETHING not allowed'
    })
  })
})
