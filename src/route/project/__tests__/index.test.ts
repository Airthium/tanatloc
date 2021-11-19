import { IRequest, IResponse, IRouteError } from '@/route'
import project from '../'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockCheckWorkspaceAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkWorkspaceAuth: async () => mockCheckWorkspaceAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status, message) => mockError(status, message)
}))

const mockAdd = jest.fn()
jest.mock('@/lib/project', () => ({
  add: async () => mockAdd()
}))

describe('route/project', () => {
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

    mockCheckWorkspaceAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id',
      title: 'title'
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
    await project(
      //@ts-ignore
      req,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  test('GET', async () => {
    req.method = 'GET'

    await project(
      //@ts-ignore
      req,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    await project(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { workspace: { id(uuid) }, project: { title(string), description(?string) } }'
    })

    // Access denied
    mockCheckWorkspaceAuth.mockImplementation(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })
    await project(
      {
        ...req,
        body: { workspace: { id: 'id' }, project: { title: 'title' } }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockCheckWorkspaceAuth.mockImplementation(() => {
      // Empty
    })
    await project(
      {
        ...req,
        body: { workspace: { id: 'id' }, project: { title: 'title' } }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      id: 'id',
      title: 'title'
    })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('Add error')
    })
    await project(
      {
        ...req,
        body: { workspace: { id: 'id' }, project: { title: 'title' } }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(4)
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

    await project(
      //@ts-ignore
      req,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
