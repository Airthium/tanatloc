import { Request, Response } from 'express'

import { IRouteError } from '@/route/index.d'

import splitStep from '../splitStep'

const mockSession = jest.fn()
jest.mock('../../../session', () => ({
  session: () => mockSession()
}))

const mockCheckGeometryAuth = jest.fn()
jest.mock('../../../auth', () => ({
  checkGeometryAuth: async () => mockCheckGeometryAuth()
}))

const mockError = jest.fn()
jest.mock('../../../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockSplitStep = jest.fn()
jest.mock('@/lib/geometry', () => ({
  splitStep: async () => mockSplitStep()
}))

describe('route/geometry/[id]/splitStep', () => {
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

    mockCheckGeometryAuth.mockReset()

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockSplitStep.mockReset()
    mockSplitStep.mockImplementation(() => 'split')

    resStatus = 0
    resJson = ''
  })

  test('no session', async () => {
    mockSession.mockImplementation(() => {
      const error: IRouteError = new Error('Unauthorized')
      error.status = 401
      throw error
    })
    await splitStep(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(0)
    expect(mockSplitStep).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
  })

  test('no id', async () => {
    await splitStep(
      {
        ...req,
        method: 'GET',
        query: {},
        params: {}
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(0)
    expect(mockSplitStep).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
  })

  test('access denied', async () => {
    mockCheckGeometryAuth.mockImplementation(() => {
      const error: IRouteError = new Error('Access denied')
      error.status = 403
      throw error
    })

    await splitStep(
      {
        ...req,
        method: 'GET',
        query: { id: 'id' } as Request['query']
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockSplitStep).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
  })

  test('wrong body', async () => {
    await splitStep(
      {
        ...req,
        method: 'POST',
        body: { project: {} },
        query: {},
        params: { id: 'id' } as Request['params']
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockSplitStep).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(2)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { project: { id(uuid) } })'
    })
  })

  test('split', async () => {
    // Normal
    await splitStep(
      {
        ...req,
        method: 'POST',
        body: { project: { id: 'id' } },
        query: {},
        params: { id: 'id' } as Request['params']
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockSplitStep).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ message: 'split' })

    // Error
    mockSplitStep.mockImplementation(() => {
      throw new Error('Split error')
    })
    await splitStep(
      {
        ...req,
        method: 'POST',
        body: { project: { id: 'id' } },
        query: {},
        params: { id: 'id' } as Request['params']
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(2)
    expect(mockSplitStep).toHaveBeenCalledTimes(2)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Split error' })
  })

  test('wrong method', async () => {
    await splitStep(
      {
        ...req,
        method: 'method',
        query: { id: 'id' } as Request['query']
      } as Request,
      res
    )
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockCheckGeometryAuth).toHaveBeenCalledTimes(1)
    expect(mockSplitStep).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(1)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })
})
