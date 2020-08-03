import login from '../../../pages/api/login'

jest.mock('next-connect', () => () => ({
  use: () => ({
    post: (param, callback) => {
      if (typeof callback === 'function') callback({}, { json: () => 'json' })
    }
  })
}))

jest.mock('../../../../middleware/auth', () => {})

jest.mock('../../../../src/auth/passport', () => ({
  authenticate: jest.fn()
}))

describe('pages/api', () => {
  it('login', () => {
    login.use().post()
  })
})
