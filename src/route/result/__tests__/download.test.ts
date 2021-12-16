import { Request, Response } from 'express'

import { IRouteError } from '@/route'
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
  download: () => mockDownload()
}))

describe('route/result/download', () => {
  const req = {} as Request
  let resStatus: number
  let resJson: string | object
  const res = {} as Response
  res.status = (status: number) => {
    resStatus = status
    return res
  }
  res.end = () => {
    resJson = 'end'
    return res
  }
  res.json = (value: object) => {
    resJson = value
    return res
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
      } as Request,
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
    // Wrong body
    await download(
      {
        ...req,
        method: 'POST',
        body: {}
      } as Request,
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
        method: 'POST',
        body: {
          simulation: { id: 'id' },
          result: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      } as Request,
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
        method: 'POST',
        body: {
          simulation: { id: 'id' },
          result: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      } as Request,
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
        method: 'POST',
        body: {
          simulation: { id: 'id' },
          result: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      } as Request,
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
    await download(
      {
        ...req,
        method: 'method',
        body: {
          simulation: { id: 'id' },
          result: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      } as Request,
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
