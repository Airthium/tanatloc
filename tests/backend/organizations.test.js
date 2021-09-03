import route from '@/pages/api/organizations'

import { initialize, clean } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import OrganizationLib from '@/lib/organization'

// Initialize
let adminUUID
let organization
beforeAll((done) => {
  new Promise(async (resolve) => {
    adminUUID = await initialize()
    organization = await OrganizationLib.add(
      { id: adminUUID },
      { name: 'Test organization' }
    )
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

describe('e2e/backend/organizations', () => {
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

  test('Unauthorized', async () => {
    await route(req, res)
    expect(resStatus).toBe(401)
    expect(resJson).toEqual({ error: true, message: 'Unauthorized' })
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

  test('Get', async () => {
    req.method = 'GET'
    await setToken()

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      organizations: [
        {
          id: organization.id,
          name: 'Test organization',
          owners: [
            {
              id: adminUUID,
              firstname: null,
              lastname: null,
              email: 'admin',
              avatar: null
            }
          ],
          users: null,
          groups: null
        }
      ]
    })

    // Error
    jest.spyOn(OrganizationLib, 'getByUser').mockImplementationOnce(() => {
      throw new Error('Get by user error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Get by user error' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Get by user error')
    )
  })
})
