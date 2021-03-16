import getSessionId from '../session'

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
  })

  it('ok', async () => {
    mockSession.mockImplementation(() => ({ id: 'id' }))

    const id = await getSessionId(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(id).toBe('id')
  })

  it('wrong', async () => {
    let id

    // No id
    mockSession.mockImplementation(() => ({}))
    id = await getSessionId(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(id).toBe(null)

    // Empty
    mockSession.mockImplementation(() => {})
    id = await getSessionId(req, res)
    expect(mockSession).toHaveBeenCalledTimes(2)
    expect(id).toBe(null)
  })

  it('error', async () => {
    mockSession.mockImplementation(() => {
      throw new Error()
    })
    const id = await getSessionId(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(id).toBe(null)
  })
})
