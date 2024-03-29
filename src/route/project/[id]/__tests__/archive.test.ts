import { Request, Response } from 'express'

import { IRouteError } from '@/route/index.d'

import archive from '../archive'

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

const mockArchive = jest.fn()
const mockUnarchiveFromFile = jest.fn()
const mockUnarchiveFromServer = jest.fn()
const mockDeleteArchiveFile = jest.fn()
jest.mock('@/lib/project', () => ({
  archive: async () => mockArchive(),
  unarchiveFromFile: async () => mockUnarchiveFromFile(),
  unarchiveFromServer: async () => mockUnarchiveFromServer(),
  deleteArchiveFile: async () => mockDeleteArchiveFile()
}))

describe('route/project/[id]/archive', () => {
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

    mockArchive.mockReset()
    mockArchive.mockImplementation(() => ({
      pipe: jest.fn()
    }))
    mockUnarchiveFromFile.mockReset()
    mockUnarchiveFromServer.mockReset()
    mockDeleteArchiveFile.mockReset()

    resStatus = 0
    resJson = ''
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await archive(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockArchive).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('no id', async () => {
    await archive(
      {
        ...req,
        query: {},
        params: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockArchive).toHaveBeenCalledTimes(0)
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

    await archive(
      {
        ...req,
        query: {},
        params: { id: 'id' } as Request['params']
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockArchive).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
  })

  test('GET', async () => {
    // Normal
    await archive(
      {
        ...req,
        method: 'GET',
        query: { id: 'id' } as Request['query'],
        params: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockArchive).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockArchive.mockImplementation(() => {
      throw new Error('Get error')
    })
    await archive(
      {
        ...req,
        method: 'GET',
        query: { id: 'id' } as Request['query'],
        params: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(2)
    expect(mockArchive).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get error'
    })
  })

  test('POST', async () => {
    // Normal
    await archive(
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
    expect(mockUnarchiveFromFile).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUnarchiveFromFile.mockImplementation(() => {
      throw new Error('unarchiveFromFile error')
    })
    await archive(
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
    expect(mockUnarchiveFromFile).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'unarchiveFromFile error'
    })
  })

  test('PUT', async () => {
    // Normal
    await archive(
      {
        ...req,
        method: 'PUT',
        query: { id: 'id' } as Request['query'],
        params: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockUnarchiveFromServer).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockUnarchiveFromServer.mockImplementation(() => {
      throw new Error('unarchiveFromFile error')
    })
    await archive(
      {
        ...req,
        method: 'PUT',
        query: { id: 'id' } as Request['query'],
        params: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(2)
    expect(mockUnarchiveFromServer).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'unarchiveFromFile error'
    })
  })

  test('DELETE', async () => {
    // Normal
    await archive(
      {
        ...req,
        method: 'DELETE',
        query: { id: 'id' } as Request['query'],
        params: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockDeleteArchiveFile).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)

    // Error
    mockDeleteArchiveFile.mockImplementation(() => {
      throw new Error('deleteArchiveFile error')
    })
    await archive(
      {
        ...req,
        method: 'DELETE',
        query: { id: 'id' } as Request['query'],
        params: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(2)
    expect(mockDeleteArchiveFile).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'deleteArchiveFile error'
    })
  })

  test('wrong method', async () => {
    await archive(
      {
        ...req,
        method: 'method',
        query: { id: 'id' } as Request['query']
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockArchive).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
