import logout from '../logout'

const mockRemove = jest.fn()
jest.mock('../../auth/auth-cookies', () => ({
  removeTokenCookie: () => mockRemove()
}))

const mockSentry = jest.fn()
jest.mock('../../lib/sentry', () => ({
  captureException: () => mockSentry()
}))

describe('src/route/api', () => {
  it('logout', () => {
    logout({}, { end: () => {} })
    expect(mockRemove).toHaveBeenCalledTimes(1)
  })

  it('error', async () => {
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
    expect(mockSentry).toHaveBeenCalledTimes(1)
  })
})
