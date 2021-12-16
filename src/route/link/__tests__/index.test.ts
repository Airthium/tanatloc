import { Request, Response } from 'express'

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
    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockGet.mockReset()
    mockProcess.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('POST', async () => {
    // Wrong body
    await link(
      {
        ...req,
        method: 'POST',
        body: {}
      } as Request,
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
        method: 'POST',
        body: {
          id: 'id',
          data: ['name']
        }
      } as Request,
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
        method: 'POST',
        body: {
          id: 'id',
          data: ['name']
        }
      } as Request,
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
    // Wrong body
    await link(
      {
        ...req,
        method: 'PUT',
        body: {}
      } as Request,
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
        method: 'PUT',
        body: { id: 'id' }
      } as Request,
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
        method: 'PUT',
        body: { id: 'id' }
      } as Request,
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
    await link(
      {
        ...req,
        method: 'method',
        body: { id: 'id' }
      } as Request,
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
