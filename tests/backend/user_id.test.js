import route from '@/pages/api/user/[id]'

import { initialize, clean } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import UserLib from '@/lib/user'

// Initialize
let adminUUID
let user
beforeAll((done) => {
  new Promise(async (resolve) => {
    adminUUID = await initialize()
    user = await UserLib.add({ email: 'email', password: 'password' })
    resolve()
  })
    .catch(console.error)
    .finally(done)
}, 20_000) // No timeout

// Clean
afterAll((done) => {
  clean().catch(console.error).finally(done)
})

// Mailersend mock
jest.mock('mailersend', () => ({
  __esModule: true,
  default: class {
    send() {
      return { status: 202, statusText: 'success' }
    }
  },
  Recipient: class {},
  EmailParams: class mockEmailParams {
    setFrom() {
      return this
    }
    setFromName() {
      return this
    }
    setRecipients() {
      return this
    }
    setSubject() {
      return this
    }
    setTemplateId() {
      return this
    }
    setPersonalization(p) {
      return this
    }
  }
}))

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/backend/user/[id]', () => {
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

    await setToken()
    await route(req, res)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
  })

  test('No id', async () => {
    req.query = {}
    req.params = {}
    await setToken()

    await UserLib.update({ id: adminUUID }, [{ key: 'superuser', value: true }])

    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(uuid) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (query: { id(uuid) })')
    )
  })

  test('Wrong method', async () => {
    req.method = 'method'
    req.query = { id: user.id }
    req.params = {}
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

  test('Get', async () => {
    req.method = 'GET'
    req.query = { id: user.id }
    req.params = {}
    await setToken()

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      user: {
        id: user.id,
        firstname: null,
        lastname: null,
        email: 'email',
        avatar: null,
        superuser: false,
        plugins: null,
        authorizedplugins: null
      }
    })
  })

  test('Update', async () => {
    req.method = 'PUT'
    req.query = { id: user.id }
    req.params = {}
    await setToken()

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body(array))'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body(array))')
    )

    // Normal
    req.body = [{ key: 'firstname', value: 'firstname' }]
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    const userData = await UserLib.get(user.id, ['firstname'])
    expect(userData).toEqual({
      id: user.id,
      firstname: 'firstname'
    })

    // Error
    jest.spyOn(UserLib, 'update').mockImplementationOnce(() => {
      throw new Error('Update error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Update error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Update error')
    )
  })

  test('Delete', async () => {
    req.method = 'DELETE'
    req.query = {}
    req.params = { id: user.id }
    await setToken()

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    jest.spyOn(UserLib, 'del').mockImplementationOnce(() => {
      throw new Error('Delete error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Delete error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Delete error')
    )
  })
})
