import route from '@/route/email'

import { PASSWORD_RECOVERY } from '@/config/email'

let mockStatus = 202
let mockStatusText = 'status'
jest.mock('mailersend', () => ({
  __esModule: true,
  default: class {
    send() {
      return { status: mockStatus, statusText: mockStatusText }
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
    setPersonalization() {
      return this
    }
  }
}))

const mockQuery = jest.fn()
jest.mock('pg', () => {
  return {
    Pool: class PoolMock {
      constructor() {
        this.connect = async () => ({
          query: async (command, args) => mockQuery(command, args),
          release: jest.fn()
        })
        this.query = async () => 'query'
        this.end = jest.fn()
      }
    }
  }
})

const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/email', () => {
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

  beforeEach(() => {
    mockQuery.mockReset()

    mockCaptureException.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('Wrong method', async () => {
    req.method = 'method'

    await route(req, res)
    expect(resStatus).toBe(405)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Method method not allowed')
    )
  })

  test('Password recovery', async () => {
    req.method = 'PUT'

    // No body
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { email(string), type(string) }'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { email(string), type(string) }'
      )
    )

    // No type
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { email(string), type(string) }'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { email(string), type(string) }'
      )
    )

    // No email
    req.body = {
      type: 'type'
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { email(string), type(string) }'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { email(string), type(string) }'
      )
    )

    // Wrong type
    req.body = {
      type: 'type',
      email: 'email'
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Type type not allowed'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Type type not allowed')
    )

    // Non existing user
    mockQuery.mockImplementation(() => ({
      rows: []
    }))
    req.body = {
      type: PASSWORD_RECOVERY,
      email: 'email'
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')

    // Existing user
    mockQuery.mockImplementation(() => ({
      rows: [{ id: 'id' }]
    }))
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')

    // Error
    mockStatus = 404
    mockStatusText = 'Mailersend error'
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Mail error: Mailersend error'
    })
  })
})
