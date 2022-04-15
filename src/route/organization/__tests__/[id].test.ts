import { Request, Response } from 'express'

import { IRouteError } from '@/route/index.d'

import id from '../[id]'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockAccept = jest.fn()
const mockDecline = jest.fn()
const mockQuit = jest.fn()
jest.mock('@/lib/organization', () => ({
  accept: async () => mockAccept(),
  decline: async () => mockDecline(),
  quit: async () => mockQuit()
}))

describe('route/organization/[id]', () => {
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
    mockSession.mockImplementation(() => 'id')

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockAccept.mockReset()
    mockDecline.mockReset()
    mockQuit.mockReset()

    resStatus = 0
    resJson = ''
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await id(
      {
        ...req
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('no id', async () => {
    await id(
      {
        ...req,
        method: 'GET',
        query: {},
        params: {},
        body: [{ key: 'key', value: 'value' }]
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
  })

  test('PUT', async () => {
    // Normal
    await id(
      {
        ...req,
        query: {},
        params: { id: 'id' } as Request['params'],
        method: 'PUT'
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAccept).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockAccept.mockImplementation(() => {
      throw new Error('accept error')
    })
    await id(
      {
        ...req,
        query: {},
        params: { id: 'id' } as Request['params'],
        method: 'PUT'
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAccept).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'accept error'
    })
  })

  test('POST', async () => {
    // Normal
    await id(
      {
        ...req,
        query: {},
        params: { id: 'id' } as Request['params'],
        method: 'POST'
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockDecline).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockDecline.mockImplementation(() => {
      throw new Error('decline error')
    })
    await id(
      {
        ...req,
        query: {},
        params: { id: 'id' } as Request['params'],
        method: 'POST'
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockDecline).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'decline error'
    })
  })

  test('DELETE', async () => {
    // Normal
    await id(
      {
        ...req,
        query: {},
        params: { id: 'id' } as Request['params'],
        method: 'DELETE'
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockQuit).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockQuit.mockImplementation(() => {
      throw new Error('quit error')
    })
    await id(
      {
        ...req,
        query: {},
        params: { id: 'id' } as Request['params'],
        method: 'DELETE'
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockQuit).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'quit error'
    })
  })

  test('wrong method', async () => {
    await id(
      {
        ...req,
        query: { id: 'id' } as Request['query'],
        params: {},
        method: 'method'
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
