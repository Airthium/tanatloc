import route from '@/pages/api/link'

import { initialize, clean } from '@/config/jest/e2e/global'

import { SUBSCRIBE, PASSWORD_RECOVERY, REVALIDATE } from '@/config/email'

import LinkLib from '@/lib/link'

// Initialize
let adminUUID
let subscribeLink
let passwordLink
let revalidateLink
let unknownLink
beforeAll((done) => {
  new Promise(async (resolve) => {
    adminUUID = await initialize()
    subscribeLink = await LinkLib.add({
      type: SUBSCRIBE,
      email: 'email',
      userid: adminUUID
    })
    passwordLink = await LinkLib.add({
      type: PASSWORD_RECOVERY,
      email: 'admin'
    })
    revalidateLink = await LinkLib.add({
      type: REVALIDATE,
      email: 'email',
      userid: adminUUID
    })
    unknownLink = await LinkLib.add({
      type: 'unknown',
      email: 'email'
    })
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
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/backend/link', () => {
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
    mockCaptureException.mockReset()

    resStatus = undefined
    resJson = undefined
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
    req.method = 'POST'

    // No body
    req.body = undefined
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid), data(array) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { id(uuid), data(array) })'
      )
    )

    // No id
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid), data(array) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { id(uuid), data(array) })'
      )
    )

    // No data
    req.body = { id: subscribeLink.id }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid), data(array) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { id(uuid), data(array) })'
      )
    )

    //  Normal
    req.body = { id: subscribeLink.id, data: ['type', 'email', 'userid'] }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      id: subscribeLink.id,
      type: SUBSCRIBE,
      email: 'email',
      userid: adminUUID
    })
  })

  test('Process', async () => {
    req.method = 'PUT'

    // No body
    req.body = undefined
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { id(uuid), data(?object) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { id(uuid), data(?object) })'
      )
    )

    // No id
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { id(uuid), data(?object) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { id(uuid), data(?object) })'
      )
    )

    // Subscribe
    req.body = { id: subscribeLink.id }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')

    const subscribeLinkDel = await LinkLib.get(subscribeLink.id, ['type'])
    expect(subscribeLinkDel).not.toBeDefined()

    // Password
    req.body = { id: passwordLink.id, data: { email: 'admin' } }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')

    const passwordLinkDel = await LinkLib.get(subscribeLink.id, ['type'])
    expect(passwordLinkDel).not.toBeDefined()

    // Revalidate
    req.body = { id: revalidateLink.id }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')

    const revalidateLinkDel = await LinkLib.get(subscribeLink.id, ['type'])
    expect(revalidateLinkDel).not.toBeDefined()

    // Unknown
    req.body = { id: unknownLink.id }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Unknown type' })

    const unknownLinkDel = await LinkLib.get(subscribeLink.id, ['type'])
    expect(unknownLinkDel).not.toBeDefined()
  })
})
