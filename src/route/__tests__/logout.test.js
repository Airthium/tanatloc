import logout from '../logout'

const mockRemove = jest.fn()
jest.mock('../../auth/auth-cookies', () => ({
  removeTokenCookie: () => mockRemove()
}))

describe('src/route/api', () => {
  it('logout', () => {
    logout({}, { end: () => {} })
    expect(mockRemove).toHaveBeenCalledTimes(1)
  })
})
