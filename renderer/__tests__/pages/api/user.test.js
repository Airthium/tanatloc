import user from '../../../pages/api/user'

jest.mock('next-connect', () => () => ({
  use: () => ({
    get: (callback) => {
      callback({}, { json: jest.fn() })
      return {
        use: (callback) => {
          callback({ user: {} }, {}, jest.fn())
          callback({}, { status: () => ({ send: jest.fn() }) }, jest.fn())
          return {
            put: (callback) => {
              callback({ body: {} }, { json: jest.fn() })
              return {
                delete: (callback) => {
                  callback(
                    { logOut: jest.fn() },
                    { status: () => ({ end: jest.fn() }) }
                  )
                }
              }
            }
          }
        }
      }
    }
  })
}))

jest.mock('../../../../middleware/auth', () => {})

describe('pages/api/user', () => {
  it('user', () => {})
})
