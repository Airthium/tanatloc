import id from '../[id]'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockAuth = jest.fn()
jest.mock('../../auth', () => () => mockAuth())

const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('../../../lib/project', () => ({
  get: async (id, data) => mockGet(id, data),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

const mockSentry = jest.fn()
jest.mock('../../../lib/sentry', () => ({
  captureException: () => mockSentry()
}))

describe('src/route/project/[id]', () => {
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

    mockAuth.mockReset()
    mockAuth.mockImplementation(() => false)

    mockGet.mockReset()
    mockGet.mockImplementation(() => ({
      id: 'id',
      title: 'title'
    }))
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockSentry.mockReset()

    req = {
      method: 'GET',
      query: { id: 'id' }
    }
    response = undefined
  })

  it('no session', async () => {
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('no authorization', async () => {
    mockSession.mockImplementation(() => 'id')

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ message: 'Unauthorized' })

    // Error
    mockAuth.mockImplementation(() => {
      throw new Error('test')
    })
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('electron', async () => {
    req.query.id = undefined
    req.params = { id: 'id' }

    mockSession.mockImplementation(() => true)
    mockAuth.mockImplementation(() => true)

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      project: {
        id: 'id',
        title: 'title'
      }
    })
  })

  it('GET', async () => {
    mockSession.mockImplementation(() => true)
    mockAuth.mockImplementation(() => true)

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      project: {
        id: 'id',
        title: 'title'
      }
    })

    // Error
    mockGet.mockImplementation((id, data) => {
      if (data.includes('title')) throw new Error('test')
    })
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('PUT', async () => {
    req.method = 'PUT'

    mockSession.mockImplementation(() => true)
    mockAuth.mockImplementation(() => true)

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('test')
    })
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('DELETE', async () => {
    req.method = 'DELETE'

    mockSession.mockImplementation(() => true)
    mockAuth.mockImplementation(() => true)

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('test')
    })
    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAuth).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'test' })
  })

  it('wrong method', async () => {
    req.method = 'SOMETHING'

    mockSession.mockImplementation(() => true)
    mockAuth.mockImplementation(() => true)

    await id(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAuth).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ message: 'Method SOMETHING not allowed' })
  })
})
