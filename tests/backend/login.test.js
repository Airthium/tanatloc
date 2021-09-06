import app from '@/pages/api/login'
import { loginRoute as route } from '@/route/login'

import { initialize, clean } from '@/config/jest/e2e/global'

// Initialize
let adminUUID
beforeAll((done) => {
  new Promise(async (resolve) => {
    adminUUID = await initialize()
    resolve()
  })
    .then(done)
    .catch((err) => {
      console.error(err)
      done()
    })
}, 20_000) // No timeout

// Clean
afterAll((done) => {
  clean().catch(console.error).finally(done)
})

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  configureScope: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/backend/login', () => {
  const req = {}
  let resStatus
  let resJson
  const res = {
    setHeader: jest.fn,
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

  beforeEach(() => {
    mockCaptureException.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('app', () => {
    expect(app).toBeDefined()
  })

  test('bad credentials', async () => {
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Bad credentials' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Bad credentials')
    )
  })

  test('ok', async () => {
    req.body = { email: 'admin', password: 'password' }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ ok: true })
  })
})
