import { session } from '../session'

const mockError = jest.fn()
jest.mock('../error', () => ({
  error: (status: number, message: string) => mockError(status, message)
}))

const mockSession = jest.fn()
jest.mock('@/auth/iron', () => ({
  getSession: () => mockSession()
}))

describe('route/session', () => {
  const req = {}

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))
  })

  test('ok', async () => {
    mockSession.mockImplementation(() => ({ id: 'id' }))

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
