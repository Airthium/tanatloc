import { IRequest, IResponse, IRouteError } from '@/route'
import id from '../[id]'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async (_, data) => mockGet(_, data),
  getWithData: async (_, data) => mockGet(_, data),
  update: async () => mockUpdate(),
  del: () => mockDel()
}))

describe('route/user/[id]', () => {
  const req: IRequest = {}
  let resStatus: number
  let resJson: any
  const res: IResponse = {
    setHeader: jest.fn,
    status: (status: number) => {
      resStatus = status
      return res
    },
    end: () => {
      resJson = 'end'
      return res
    },
    json: (value: object) => {
      resJson = value
      return res
    }
  }

  beforeEach(() => {
    mockSession.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockGet.mockReset()
    mockGet.mockImplementation(() => ({
      id: 'id',
      name: 'name'
    }))
    mockUpdate.mockReset()
    mockDel.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('no superuser', async () => {
    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
  })

  test('no id', async () => {
    req.query = {}
    req.params = {}

    mockGet.mockImplementation(() => ({ superuser: true }))

    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(uuid) })'
    })
  })

  test('GET', async () => {
    req.method = 'GET'
    req.query = {}
    req.params = { id: 'id' }

    mockGet.mockImplementation(() => ({ superuser: true, id: 'id' }))

    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      user: {
        id: 'id',
        superuser: true
      }
    })

    // Error
    mockGet.mockImplementation((_, data) => {
      if (data.includes('firstname')) throw new Error('Get error')
      return { superuser: true }
    })
    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Get error' })
  })

  test('PUT', async () => {
    req.method = 'PUT'

    mockGet.mockImplementation(() => ({ superuser: true }))

    // Wrong body
    await id(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body(array))'
    })

    // Normal
    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Update error' })
  })

  test('DELETE', async () => {
    req.method = 'DELETE'

    mockGet.mockImplementation(() => ({ superuser: true }))

    // Normal
    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('Delete error')
    })
    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Delete error' })
  })

  test('wrong method', async () => {
    req.method = 'method'
    req.query = { id: 'id' }
    req.params = {}

    mockGet.mockImplementation(() => ({ superuser: true }))

    await id(
      {
        ...req,
        body: [{ key: 'key', value: 'value' }]
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
