import app from '../app'

jest.mock('http-errors', () => () => {})
jest.mock('express', () => ({
  __esModule: true,
  default: () => ({
    disable: () => {},
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
    all: jest.fn((param, callback) => {
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

jest.mock('@/route/login', () => ({
  loginRoute: () => {}
}))
jest.mock('@/route/logout', () => () => {})
jest.mock('@/route/user', () => () => {})
jest.mock('@/route/user/check', () => () => {})
jest.mock('@/route/avatar', () => () => {})
jest.mock('@/route/workspace', () => () => {})
jest.mock('@/route/project', () => () => {})
jest.mock('@/route/project/[id]', () => () => {})
jest.mock('@/route/projects', () => () => {})
jest.mock('@/route/simulation', () => () => {})
jest.mock('@/route/simulation/[id]', () => () => {})
jest.mock('@/route/simulation/[id]/run', () => () => {})
jest.mock('@/route/simulations', () => () => {})
jest.mock('@/route/part', () => () => {})
jest.mock('@/route/file', () => () => {})
jest.mock('@/route/plugin', () => () => {})

describe('server/app', () => {
  it('app', () => {
    expect(app).toBeDefined()
  })
})
