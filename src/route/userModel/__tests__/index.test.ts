import { Request, Response } from 'express'

import { IRouteError } from '@/route/index.d'

import userModel from '..'

const mockSession = jest.fn()
jest.mock('../../session', () => ({
  session: () => mockSession()
}))

const mockError = jest.fn()
jest.mock('../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockAdd = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/lib/userModel', () => ({
  add: async () => mockAdd(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

describe('route/userModel', () => {
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

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockUpdate.mockReset()
    mockDel.mockReset()

    resStatus = 0
    resJson = ''
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await userModel(
      {
        ...req
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('POST', async () => {
    // Wrong body
    await userModel(
      {
        ...req,
        method: 'POST',
        body: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { userModel: { model(IModel), template(string) } })'
    })

    // Normal
    await userModel(
      {
        ...req,
        method: 'POST',
        body: {
          userModel: { model: {}, template: 'template' }
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      id: 'id'
    })

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('Add error')
    })
    await userModel(
      {
        ...req,
        method: 'POST',
        body: {
          userModel: { model: {}, template: 'template' }
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Add error'
    })
  })

  test('PUT', async () => {
    // Wrong body
    await userModel(
      {
        ...req,
        method: 'PUT',
        body: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { userModel: { id(string) }, data(array) })'
    })

    // Normal
    await userModel(
      {
        ...req,
        method: 'PUT',
        body: {
          userModel: { id: 'id' },
          data: [{ key: 'key', value: 'value' }]
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('Update error')
    })
    await userModel(
      {
        ...req,
        method: 'PUT',
        body: {
          userModel: { id: 'id' },
          data: [{ key: 'key', value: 'value' }]
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Update error'
    })
  })

  test('DELETE', async () => {
    // Wrong body
    await userModel(
      {
        ...req,
        method: 'DELETE',
        body: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missin data in your request (body: { userModel: { id(string) } })'
    })

    // Normal
    await userModel(
      {
        ...req,
        method: 'DELETE',
        body: {
          userModel: { id: 'id' }
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('Delete error')
    })
    await userModel(
      {
        ...req,
        method: 'DELETE',
        body: {
          userModel: { id: 'id' }
        }
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(3)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Delete error' })
  })

  test('wrong method', async () => {
    await userModel(
      {
        ...req,
        method: 'method',
        body: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
