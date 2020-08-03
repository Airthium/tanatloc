import logout from '../../../pages/api/logout'

jest.mock('next-connect', () => () => ({
  use: () => ({
    get: (callback) => {
      if (typeof callback === 'function')
        callback(
          { logOut: jest.fn() },
          {
            status: () => ({
              end: jest.fn()
            })
          }
        )
    }
  })
}))

jest.mock('../../../../middleware/auth', () => {})

describe('pages/api', () => {
  it('logout', () => {
    logout.use().get()
  })
})
