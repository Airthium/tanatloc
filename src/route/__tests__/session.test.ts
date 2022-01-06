import { Request } from 'express'

import { session } from '../session'

const mockError = jest.fn()
jest.mock('../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockSession = jest.fn()
jest.mock('@/auth/iron', () => ({
  getSession: () => mockSession()
}))

const mockUserGet = jest.fn()
jest.mock('@/lib/user', () => ({
  get: async () => mockUserGet()
}))

describe('route/session', () => {
  const req = {} as Request

  beforeEach(() => {
    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))

    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockUserGet.mockReset()
  })

  test('ok', async () => {
    mockSession.mockImplementation(() => ({ id: 'id' }))
    mockUserGet.mockImplementation(() => ({}))

    const id = await session(req)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(id).toBe('id')
  })

  test('wrong', async () => {
    // No id
    mockSession.mockImplementation(() => ({}))
    try {
      await session(req)
      expect(true).toBe(false)
    } catch (err) {
      expect(mockSession).toHaveBeenCalledTimes(1)
      expect(err.status).toBe(401)
      expect(err.message).toBe('Unauthorized')
    }

    // Empty
    mockSession.mockImplementation(() => {
      // Empty
    })
    try {
      await session(req)
      expect(true).toBe(false)
    } catch (err) {
      expect(mockSession).toHaveBeenCalledTimes(2)
      expect(err.status).toBe(401)
      expect(err.message).toBe('Unauthorized')
    }

    // No existing user
    mockSession.mockImplementation(() => ({ id: 'id' }))
    try {
      await session(req)
      expect(true).toBe(false)
    } catch (err) {
      expect(mockSession).toHaveBeenCalledTimes(3)
      expect(err.status).toBe(401)
      expect(err.message).toBe('Unauthorized')
    }
  })

  test('error', async () => {
    mockSession.mockImplementation(() => {
      throw new Error()
    })
    try {
      await session(req)
      expect(true).toBe(false)
    } catch (err) {
      expect(mockSession).toHaveBeenCalledTimes(1)
      expect(err.status).toBe(401)
      expect(err.message).toBe('Unauthorized')
    }
  })
})
