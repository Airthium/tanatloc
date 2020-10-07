import check from '../check'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockLogin = jest.fn()
jest.mock('../../../lib/user', () => ({
  login: async () => mockLogin()
}))

const mockSentry = jest.fn()
jest.mock('../../../lib/sentry', () => ({
  captureException: () => mockSentry()
}))

describe('src/route/user/check', () => {
  let req, response
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      }
    })
  }

  beforeEach(() => {
    mockSession.mockReset()
    mockSession.mockImplementation(() => false)

    mockLogin.mockReset()

    mockSentry.mockReset()

    req = {}
    response = undefined
  })

  it('no session', async () => {
    await check(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(0)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  it('session', async () => {
    mockSession.mockImplementation(() => true)
    mockLogin.mockImplementation(() => ({}))

    await check(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ valid: true })
  })

  it('not authorized', async () => {
    mockSession.mockImplementation(() => true)

    await check(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ valid: false })
  })

  it('error', async () => {
    mockSession.mockImplementation(() => true)
    mockLogin.mockImplementation(() => {
      throw new Error('test')
    })

    await check(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })
})
