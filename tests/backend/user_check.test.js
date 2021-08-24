import route from '@/route/user/check'

import { initialize, clean } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import UserLib from '@/lib/user'

// Initialize
let adminUUID
beforeAll((done) => {
  new Promise(async (resolve) => {
    adminUUID = await initialize()
    resolve()
  })
    .catch(console.error)
    .finally(done)
}, 20_000) // No timeout

// Clean
afterAll((done) => {
  clean().catch(console.error).finally(done)
})

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/backend/user/check', () => {
  const req = {}
  let resStatus
  let resJson
  const res = {
    status: (code) => {
      resStatus = code
      return {
        json: (object) => {
          resJson = object
        },
        end: () => {
          resJson = 'end'
        }
      }
    }
  }

  const setToken = async () => {
    req.headers = {
      cookie: 'token=' + (await encryptSession({ id: adminUUID })) + ';'
    }
  }

  beforeEach(() => {
    mockCaptureException.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  afterEach(() => {
    req.headers = null
  })

  test('Unauthorized', async () => {
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })
  })

  test('Wrong method', async () => {
    req.method = 'method'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Method method not allowed')
    )
  })

  test('Check', async () => {
    req.method = 'POST'
    await setToken()

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { email(string), password(string) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { email(string), password(string) })'
      )
    )

    // Correct
    req.body = { email: 'admin', password: 'password' }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ valid: true })

    // Not correct
    req.body = { email: 'admin', password: 'other_password' }
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ valid: false })

    // Error
    jest.spyOn(UserLib, 'login').mockImplementationOnce(() => {
      throw new Error('Login error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Login error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Login error')
    )
  })
})
