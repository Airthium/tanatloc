import { IRequest, IResponse } from '@/route'
import link from '..'

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockGet = jest.fn()
const mockProcess = jest.fn()
jest.mock('@/lib/link', () => ({
  get: async () => mockGet(),
  process: async () => mockProcess()
}))

describe('route/link', () => {
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
    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockGet.mockReset()
    mockProcess.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('POST', async () => {
    req.method = 'POST'

    // Wrong body
    await link(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid), data(array) })'
    })

    // Normal
    mockGet.mockImplementation(() => ({}))
    await link(
      {
        ...req,
        body: {
          id: 'id',
          //@ts-ignore
          data: ['name']
        }
      },
      res
    )
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({})

    // Error
    mockGet.mockImplementation(() => {
      throw new Error('Get error')
    })
    await link(
      {
        ...req,
        body: {
          id: 'id',
          //@ts-ignore
          data: ['name']
        }
      },
      res
    )
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get error'
    })
  })

  test('PUT', async () => {
    req.method = 'PUT'

    // Wrong body
    await link(
      {
        ...req,
        //@ts-ignore
        body: {}
      },
      res
    )
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { id(uuid), data(?object) })'
    })

    // Normal
    await link(
      {
        ...req,
        //@ts-ignore
        body: { id: 'id' }
      },
      res
    )
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockProcess.mockImplementation(() => {
      throw new Error('Process error')
    })
    await link(
      {
        ...req,
        //@ts-ignore
        body: { id: 'id' }
      },
      res
    )
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Process error'
    })
  })

  test('wrong method', async () => {
    req.method = 'method'

    await link(
      {
        ...req,
        //@ts-ignore
        body: { id: 'id' }
      },
      res
    )
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockProcess).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
