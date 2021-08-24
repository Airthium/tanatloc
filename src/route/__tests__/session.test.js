import getSessionId from '../session'

const mockError = jest.fn()
jest.mock('../error', () => (status, message) => mockError(status, message))

const mockSession = jest.fn()
jest.mock('@/auth/iron', () => ({
  getSession: () => mockSession()
}))

describe('route/session', () => {
  const req = {}
  const res = {
    status: () => ({
      json: () => {}
    })
  }

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockError.mockReset()
    mockError.mockImplementation((status, message) => ({ status, message }))
  })

  test('ok', async () => {
    mockSession.mockImplementation(() => ({ id: 'id' }))

    const id = await getSessionId(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(id).toBe('id')
  })

  test('wrong', async () => {
    let id

    // No id
    mockSession.mockImplementation(() => ({}))
    try {
      await getSessionId(req, res)
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
      await getSessionId(req, res)
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
      await getSessionId(req, res)
      expect(true).toBe(false)
    } catch (err) {
      expect(mockSession).toHaveBeenCalledTimes(1)
      expect(err.status).toBe(401)
      expect(err.message).toBe('Unauthorized')
    }
  })
})
