import { Request, Response } from 'express'

import { IRouteError } from '@/route/index.d'

import copy from '../copy'

const mockSession = jest.fn()
jest.mock('../../../session', () => ({
  session: () => mockSession()
}))

const mockCheckProjectAuth = jest.fn()
jest.mock('../../../auth', () => ({
  checkProjectAuth: async () => mockCheckProjectAuth()
}))

const mockError = jest.fn()
jest.mock('../../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockCopy = jest.fn()
jest.mock('@/lib/project', () => ({
  copy: async () => mockCopy()
}))

describe('route/project/[id]/copy', () => {
  const req = {} as Request
  let resStatus: number
  let resJson: string | object
  const res = {} as Response
  res.setHeader = jest.fn()
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

    mockCheckProjectAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockCopy.mockReset()
    mockCopy.mockImplementation(() => ({}))

    resStatus = 0
    resJson = ''
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await copy(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockCopy).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('no id', async () => {
    await copy(
      {
        ...req,
        query: {},
        params: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockCopy).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
  })

  test('Access denied', async () => {
    mockCheckProjectAuth.mockImplementation(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })

    await copy(
      {
        ...req,
        query: {},
        params: { id: 'id' } as Request['params']
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockCopy).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
  })

  test('POST', async () => {
    // Normal
    await copy(
      {
        ...req,
        method: 'POST',
        query: { id: 'id' } as Request['query'],
        params: {},
        body: {
          archive: 'archive'
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockCopy).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockCopy.mockImplementation(() => {
      throw new Error('unarchiveFromFile error')
    })
    await copy(
      {
        ...req,
        method: 'POST',
        query: { id: 'id' } as Request['query'],
        params: {},
        body: { archive: 'archive' }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(2)
    expect(mockCopy).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'unarchiveFromFile error'
    })
  })

  test('wrong method', async () => {
    await copy(
      {
        ...req,
        method: 'method',
        query: { id: 'id' } as Request['query']
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockCopy).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
