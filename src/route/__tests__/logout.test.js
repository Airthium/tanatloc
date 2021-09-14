import logout from '../logout'

const mockRemove = jest.fn()
jest.mock('@/auth/auth-cookies', () => ({
  removeTokenCookie: () => mockRemove()
}))

const mockError = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: () => mockError()
}))

describe('route/api', () => {
  const req = {}
  const res = {
    status: () => ({
      end: jest.fn,
      json: jest.fn
    })
  }

  test('logout', () => {
    logout(req, res)
    expect(mockRemove).toHaveBeenCalledTimes(1)
  })

  test('error', async () => {
    mockRemove.mockImplementation(() => {
      throw new Error()
    })
    await logout(req, res)
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
