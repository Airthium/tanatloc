import { IRequest, IResponse, IRouteError } from '@/route'
import { WriteStream } from 'fs'
import download from '../download'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockCheckSimulationAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkSimulationAuth: async () => mockCheckSimulationAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockDownload = jest.fn()
jest.mock('@/lib/result', () => ({
  download: async () => mockDownload()
}))

describe('route/result/download', () => {
  const req: IRequest = {}
  let resStatus: number
  let resJson: any
  const res: IResponse & WriteStream = {
    ...WriteStream.constructor(),
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
    mockSession.mockImplementation(() => false)

    mockCheckSimulationAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockDownload.mockReset()
    mockDownload.mockImplementation(() => ({
      pipe: (res) => {
        res.status(200).end()
      }
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
    await download(
      {
        ...req,
        body: {
          simulation: { id: 'id' },
          result: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockDownload).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    await download(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockDownload).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), fileName(string) } }'
    })

    // Access denied
    mockCheckSimulationAuth.mockImplementation(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })
    await download(
      {
        ...req,
        body: {
          simulation: { id: 'id' },
          result: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(1)
    expect(mockDownload).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })

    // Normal
    mockCheckSimulationAuth.mockImplementation(() => {
      // Empty
    })
    await download(
      {
        ...req,
        body: {
          simulation: { id: 'id' },
          result: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(2)
    expect(mockDownload).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockDownload.mockImplementation(() => {
      throw new Error('Archive error')
    })
    await download(
      {
        ...req,
        body: {
          simulation: { id: 'id' },
          result: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(3)
    expect(mockDownload).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Archive error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await download(
      {
        ...req,
        body: {
          simulation: { id: 'id' },
          result: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      },
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckSimulationAuth).toHaveBeenCalledTimes(0)
    expect(mockDownload).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
