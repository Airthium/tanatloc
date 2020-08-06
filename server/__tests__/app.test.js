import app from '../app'

jest.mock('http-errors', () => () => {})
jest.mock('express', () => ({
  __esModule: true,
  default: () => ({
    use: jest.fn((callback) => {
      if (typeof callback === 'function') {
        if (callback.length === 3) callback({}, {}, jest.fn())
        if (callback.length === 4) {
          const err = {}
          const req = {
            app: {
              get: () => 'development'
            }
          }
          const res = {
            locals: {},
            status: jest.fn(),
            send: jest.fn()
          }
          callback(err, req, res, jest.fn())

          req.app.get = () => 'production'
          callback(err, req, res, jest.fn())
        }
      }
    }),
    get: jest.fn((param, callback) => {
      callback()
    }),
    post: jest.fn((param, callback) => {
      callback()
    })
  }),
  json: jest.fn(),
  urlencoded: jest.fn()
}))
jest.mock('cors', () => () => {})

jest.mock('../../renderer/pages/api/login', () => ({
  loginRoute: () => {}
}))
jest.mock('../../renderer/pages/api/logout', () => () => {})
jest.mock('../../renderer/pages/api/user', () => () => {})
jest.mock('../../renderer/pages/api/workspace', () => () => {})

describe('server/app', () => {
  it('app', () => {
    expect(app).toBeDefined()
  })
})
