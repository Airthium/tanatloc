import auth from '../auth'

jest.mock('next-connect', () => () => ({
  use: () => ({
    use: () => ({
      use: () => 'auth'
    })
  })
}))

jest.mock('../../src/auth/passport', () => ({
  initialize: jest.fn(),
  session: jest.fn()
}))

jest.mock('../../src/auth/session', () => () => {})

describe('middleware/auth', () => {
  it('exists', () => {
    expect(auth).toBe('auth')
  })
})
