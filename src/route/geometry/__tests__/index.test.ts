import { Request, Response } from 'express'

import { IRouteError } from '@/route/index.d'

import geometry from '../'

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
jest.mock('@/lib/geometry', () => ({
  add: async () => mockAdd()
}))

describe('route/geometry', () => {
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

    mockCheckProjectAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id',
      name: 'name'
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
    await geometry(
      {
        ...req,
        body: {
          project: { id: 'id' },
          geometry: { name: 'name', uid: 'uid', buffer: Buffer.from('buffer') }
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  test('GET', async () => {
    await geometry(
      {
        ...req,
        method: 'GET',
        body: {
          project: { id: 'id' },
          geometry: { name: 'name', uid: 'uid', buffer: Buffer.from('buffer') }
        }
      } as Request,
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
    // Wrong body
    await geometry(
      {
        ...req,
        method: 'POST',
        body: {}
      } as Request,
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
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })

    // Auth error
    mockCheckProjectAuth.mockImplementation(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })
    await geometry(
      {
        ...req,
        method: 'POST',
        body: {
          project: { id: 'id' },
          geometry: { name: 'name', uid: 'uid', buffer: Buffer.from('buffer') }
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({ error: true, message: 'Access denied' })

    // Normal
    mockCheckProjectAuth.mockImplementation(() => true)
    await geometry(
      {
        ...req,
        method: 'POST',
        body: {
          project: { id: 'id' },
          geometry: { name: 'name', uid: 'uid', buffer: Buffer.from('buffer') }
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ id: 'id', name: 'name' })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('Add error')
    })
    await geometry(
      {
        ...req,
        method: 'POST',
        body: {
          project: { id: 'id' },
          geometry: { name: 'name', uid: 'uid', buffer: Buffer.from('buffer') }
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(4)
    expect(mockCheckProjectAuth).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Add error' })
  })

  test('wrong method', async () => {
    await geometry(
      {
        ...req,
        method: 'method',
        body: {
          project: { id: 'id' },
          geometry: { name: 'name', uid: 'uid', buffer: Buffer.from('buffer') }
        }
      } as Request,
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
