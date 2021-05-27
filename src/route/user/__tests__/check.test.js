import check from '../check'

const mockSession = jest.fn()
jest.mock('../../session', () => () => mockSession())

const mockLogin = jest.fn()
jest.mock('@/lib/user', () => ({
  login: async () => mockLogin()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/user/check', () => {
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

    mockError.mockReset()

    req = {}
    response = undefined
  })

  test('no session', async () => {
    await check(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(0)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toBe(undefined)
  })

  test('session', async () => {
    mockSession.mockImplementation(() => true)
    mockLogin.mockImplementation(() => ({}))

    await check(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ valid: true })
  })

  test('not authorized', async () => {
    mockSession.mockImplementation(() => true)

    await check(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(0)
    expect(response).toEqual({ valid: false })
  })

  test('error', async () => {
    mockSession.mockImplementation(() => true)
    mockLogin.mockImplementation(() => {
      throw new Error('test')
    })

    await check(req, res)
    expect(mockSession).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
