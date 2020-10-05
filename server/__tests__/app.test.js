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

jest.mock('../../src/route/login', () => ({
  loginRoute: () => {}
}))
jest.mock('../../src/route/logout', () => () => {})
jest.mock('../../src/route/user', () => () => {})
jest.mock('../../src/route/user/check', () => () => {})
jest.mock('../../src/route/avatar', () => () => {})
jest.mock('../../src/route/workspace', () => () => {})
jest.mock('../../src/route/project', () => () => {})
jest.mock('../../src/route/project/[id]', () => () => {})
jest.mock('../../src/route/projects', () => () => {})
jest.mock('../../src/route/projects/[ids]', () => () => {})
jest.mock('../../src/route/simulation', () => () => {})
jest.mock('../../src/route/simulation/[id]', () => () => {})
jest.mock('../../src/route/simulations', () => () => {})
jest.mock('../../src/route/simulations/[ids]', () => () => {})
jest.mock('../../src/route/part', () => () => {})

describe('server/app', () => {
  it('app', () => {
    expect(app).toBeDefined()
  })
})
