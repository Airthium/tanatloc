import logout from '../../../pages/api/logout'

const mockRemove = jest.fn()
jest.mock('../../../../src/auth/auth-cookies', () => ({
  removeTokenCookie: () => mockRemove()
}))

describe('pages/api', () => {
  it('logout', () => {
    logout({}, { end: () => {} })
    expect(mockRemove).toHaveBeenCalledTimes(1)
  })
})
