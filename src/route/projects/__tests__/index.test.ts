import { Request, Response } from 'express'

import { IRouteError } from '@/route/index.d'

import ids from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: async () => mockSession()
}))

const mockCheckProjectAuth = jest.fn()
jest.mock('../../auth', () => ({
  checkProjectAuth: async () => mockCheckProjectAuth()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockProjectGetWithData = jest.fn()
jest.mock('@/lib/project', () => ({
  getWithData: async () => mockProjectGetWithData()
}))

describe('route/projects/ids', () => {
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

    mockCheckProjectAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockProjectGetWithData.mockReset()
    mockProjectGetWithData.mockImplementation(() => ({
      id: 'id',
      title: 'title'
    }))

    resStatus = 0
    resJson = ''
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await ids(
      {
        ...req,
        body: {
          ids: ['id1']
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockProjectGetWithData).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('POST', async () => {
    // Wrong body
    await ids(
      {
        ...req,
        method: 'POST',
        body: undefined
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockProjectGetWithData).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { ids(?array) })'
    })

    // No ids
    await ids(
      {
        ...req,
        method: 'POST',
        body: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockProjectGetWithData).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      projects: []
    })

    // Normal
    mockProjectGetWithData
      .mockImplementationOnce(() => ({
        id: 'id',
        name: 'name'
      }))
      .mockImplementation(() => undefined)
    mockCheckProjectAuth
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => {
        const error: IRouteError = new Error('Access denied')
        error.status = 403
        throw error
      })
      .mockImplementationOnce(() => undefined)
    await ids(
      {
        ...req,
        method: 'POST',
        body: {
          ids: ['id1', 'id2', 'id3']
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(3)
    expect(mockProjectGetWithData).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      projects: [{ id: 'id', name: 'name' }]
    })
  })

  test('wrong method', async () => {
    await ids(
      {
        ...req,
        method: 'method',
        body: {
          ids: ['id1']
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockProjectGetWithData).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
