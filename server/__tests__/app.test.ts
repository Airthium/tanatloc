import app from '../app'

jest.mock('http-errors', () => jest.fn())
jest.mock('express', () => ({
  __esModule: true,
  default: () => ({
    disable: jest.fn(),
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
jest.mock('cors', () => jest.fn())

jest.mock('@/route/login', () => ({
  loginRoute: jest.fn()
}))
jest.mock('@/route/avatar', () => jest.fn())
jest.mock('@/route/email', () => jest.fn())
jest.mock('@/route/geometries', () => jest.fn())
jest.mock('@/route/geometry', () => jest.fn())
jest.mock('@/route/geometry/[id]', () => jest.fn())
jest.mock('@/route/geometry/[id]/download', () => jest.fn())
jest.mock('@/route/geometry/[id]/part', () => jest.fn())
jest.mock('@/route/group', () => jest.fn())
jest.mock('@/route/groups', () => jest.fn())
jest.mock('@/route/groups/[id]', () => jest.fn())
jest.mock('@/route/link', () => jest.fn())
jest.mock('@/route/organization', () => jest.fn())
jest.mock('@/route/organizations', () => jest.fn())
jest.mock('@/route/plugin', () => jest.fn())
jest.mock('@/route/plugins', () => jest.fn())
jest.mock('@/route/project', () => jest.fn())
jest.mock('@/route/project/[id]', () => jest.fn())
jest.mock('@/route/projects', () => jest.fn())
jest.mock('@/route/result', () => jest.fn())
jest.mock('@/route/result/download', () => jest.fn())
jest.mock('@/route/result/archive', () => jest.fn())
jest.mock('@/route/simulation', () => jest.fn())
jest.mock('@/route/simulation/[id]', () => jest.fn())
jest.mock('@/route/simulation/[id]/run', () => jest.fn())
jest.mock('@/route/simulation/[id]/stop', () => jest.fn())
jest.mock('@/route/simulation/[id]/log', () => jest.fn())
jest.mock('@/route/simulation/[id]/tasks', () => jest.fn())
jest.mock('@/route/simulations', () => jest.fn())
jest.mock('@/route/system', () => jest.fn())
jest.mock('@/route/user', () => jest.fn())
jest.mock('@/route/user/[id]', () => jest.fn())
jest.mock('@/route/user/check', () => jest.fn())
jest.mock('@/route/users', () => jest.fn())
jest.mock('@/route/workspace', () => jest.fn())
jest.mock('@/route/logout', () => ({
  logout: jest.fn()
}))

describe('server/app', () => {
  test('app', () => {
    expect(app).toBeDefined()
  })
})
