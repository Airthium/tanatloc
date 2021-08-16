import route from '@/route/email'

import { clean } from '@/config/jest/e2e/global'

import { DOMAIN } from '@/config/domain'
import { PASSWORD_RECOVERY } from '@/config/email'

import LinkLib from '@/lib/link'

// Clean
afterAll((done) => {
  clean().catch(console.error).finally(done)
})

// mailersend mock
const mockSend = jest.fn()
let personalization
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
      personalization = p
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

describe('e2e/backend/email', () => {
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
    mockSend.mockReset()

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
    req.body = {
      type: PASSWORD_RECOVERY,
      email: 'email'
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')
    expect(personalization).not.toBeDefined()

    // Existing user
    mockSend.mockImplementationOnce(() => ({
      status: 202,
      statusText: 'success'
    }))
    req.body = {
      type: PASSWORD_RECOVERY,
      email: 'admin'
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')

    // Process link
    let url
    let linkId
    let link

    url = personalization[0].data.recoveryLink
    expect(personalization).toEqual([
      {
        email: 'admin',
        data: {
          recoveryLink: url
        }
      }
    ])

    linkId = url.replace(DOMAIN + '/password?id=', '')

    // Check link
    link = await LinkLib.get(linkId, ['type', 'email', 'userid'])
    expect(link).toEqual({
      id: linkId,
      type: PASSWORD_RECOVERY,
      email: 'admin',
      userid: null
    })

    // Process link, wrong email
    try {
      await LinkLib.process(linkId, { email: 'email' })
      expect(true).toBe(false)
    } catch (err) {
      expect(err).toEqual(new Error('Inconsistent data'))
    }

    // Process link
    await LinkLib.process(linkId, { email: 'admin' })
    link = await LinkLib.get(linkId, ['type', 'email', 'userid'])
    expect(link).not.toBeDefined()

    // Mailersend Error
    mockSend.mockImplementationOnce(() => ({
      status: 401,
      statusText: 'Unauthorized'
    }))
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Mail error: Unauthorized'
    })

    // Test link
    url = personalization[0].data.recoveryLink
    expect(personalization).toEqual([
      {
        email: 'admin',
        data: {
          recoveryLink: url
        }
      }
    ])

    linkId = url.replace(DOMAIN + '/password?id=', '')

    link = await LinkLib.get(linkId, ['type', 'email', 'userid'])
    expect(link).not.toBeDefined()
  })
})
