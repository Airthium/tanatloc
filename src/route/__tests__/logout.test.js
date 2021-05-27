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
  test('logout', () => {
    logout({}, { end: () => {} })
    expect(mockRemove).toHaveBeenCalledTimes(1)
  })

  test('error', async () => {
    mockRemove.mockImplementation(() => {
      throw new Error()
    })
    await logout(
      {},
      {
        status: () => ({
          json: () => {}
        })
      }
    )
    expect(mockError).toHaveBeenCalledTimes(1)
  })
})
