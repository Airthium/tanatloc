import { IRequest, IResponse, IRouteError } from '@/route'
import simulation from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockCheckProjectAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkProjectAuth: async () => mockCheckProjectAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockAdd = jest.fn()
jest.mock('@/lib/simulation', () => ({
  add: async () => mockAdd()
}))

describe('route/simulation', () => {
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

    mockCheckProjectAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id',
      name: 'name'
    }))

    resStatus = undefined
    resJson = undefined
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await simulation(
      {
        ...req,
        body: {
          project: { id: 'id' },
          simulation: {
            name: 'name',
            scheme: {
              category: 'category',
              name: 'name',
              algorithm: 'algorithm',
              code: 'code',
              version: 'version',
              description: 'description',
              configuration: {}
            }
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('GET', async () => {
    req.method = 'GET'

    await simulation(
      {
        ...req,
        body: {
          project: { id: 'id' },
          simulation: {
            name: 'name',
            scheme: {
              category: 'category',
              name: 'name',
              algorithm: 'algorithm',
              code: 'code',
              version: 'version',
              description: 'description',
              configuration: {}
            }
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    await simulation(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, simulation: { name(string), scheme(object) } }'
    })

    // Access denied
    mockCheckProjectAuth.mockImplementation(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })
    await simulation(
      {
        ...req,
        body: {
          project: { id: 'id' },
          simulation: {
            name: 'name',
            scheme: {
              category: 'category',
              name: 'name',
              algorithm: 'algorithm',
              code: 'code',
              version: 'version',
              description: 'description',
              configuration: {}
            }
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockCheckProjectAuth.mockImplementation(() => {
      // Empty
    })
    await simulation(
      {
        ...req,
        body: {
          project: { id: 'id' },
          simulation: {
            name: 'name',
            scheme: {
              category: 'category',
              name: 'name',
              algorithm: 'algorithm',
              code: 'code',
              version: 'version',
              description: 'description',
              configuration: {}
            }
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      id: 'id',
      name: 'name'
    })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('Add error')
    })
    await simulation(
      {
        ...req,
        body: {
          project: { id: 'id' },
          simulation: {
            name: 'name',
            scheme: {
              category: 'category',
              name: 'name',
              algorithm: 'algorithm',
              code: 'code',
              version: 'version',
              description: 'description',
              configuration: {}
            }
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Add error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await simulation(
      {
        ...req,
        body: {
          project: { id: 'id' },
          simulation: {
            name: 'name',
            scheme: {
              category: 'category',
              name: 'name',
              algorithm: 'algorithm',
              code: 'code',
              version: 'version',
              description: 'description',
              configuration: {}
            }
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
