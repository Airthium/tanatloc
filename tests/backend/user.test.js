import route from '@/pages/api/user'

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

// Mailersend mock
const mockSend = jest.fn()
jest.mock('mailersend', () => ({
  __esModule: true,
  default: class {
    send() {
      return mockSend()
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

describe('e2e/backend/user', () => {
  let newUser

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

  const setToken = async (id) => {
    req.headers = {
      cookie: 'token=' + (await encryptSession({ id: id || adminUUID })) + ';'
    }
  }

  beforeEach(() => {
    mockSend.mockReset()

    mockCaptureException.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  afterEach(() => {
    req.headers = null
  })

  test('Wrong method', async () => {
    req.method = 'method'

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

    // Unauthorized
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })

    await setToken()
    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      user: {
        id: adminUUID,
        firstname: null,
        lastname: null,
        email: 'admin',
        avatar: null,
        superuser: false,
        plugins: null,
        authorizedplugins: null
      }
    })

    // Error
    jest.spyOn(UserLib, 'get').mockImplementationOnce(() => {
      throw new Error('Get error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Get error')
    )
  })

  test('Add', async () => {
    req.method = 'POST'

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

    // Normal
    mockSend.mockImplementation(() => ({
      status: 202,
      statusText: 'success'
    }))
    req.body = { email: 'email', password: 'password' }
    await route(req, res)
    expect(resStatus).toBe(200)
    newUser = resJson
    expect(resJson).toEqual({
      id: newUser.id,
      email: 'email'
    })
    expect(mockSend).toHaveBeenCalledTimes(1)

    // Already exists
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      alreadyExists: true
    })
    expect(mockSend).toHaveBeenCalledTimes(1)

    // Error
    jest.spyOn(UserLib, 'add').mockImplementationOnce(() => {
      throw new Error('Add error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Add error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Add error')
    )
  })

  test('Update', async () => {
    req.method = 'PUT'

    // Unauthorized
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({
      error: true,
      message: 'Unauthorized'
    })

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

    const user = await UserLib.get(adminUUID, ['firstname'])
    expect(user).toEqual({
      id: adminUUID,
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

    // Unauthorized
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })

    await setToken(newUser.id)
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
