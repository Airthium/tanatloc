import route from '@/route/groups/[id]'

import { initialize, clean } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import OrganizationLib from '@/lib/organization'
import GroupLib from '@/lib/group'
import UserLib from '@/lib/user'

// Initialize
let adminUUID
let organization
let group
beforeAll((done) => {
  new Promise(async (resolve) => {
    adminUUID = await initialize()
    organization = await OrganizationLib.add(
      { id: adminUUID },
      { name: 'Test organization' }
    )
    group = await GroupLib.add(
      { id: organization.id },
      { name: 'Test group', users: [adminUUID] }
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

describe('e2e/backend/groups/[id]', () => {
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

  test('No id', async () => {
    req.query = {}
    req.params = {}
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (query: { id(string) })')
    )
  })

  test('Wrong method', async () => {
    req.query = { id: organization.id }
    req.params = {}
    req.method = 'method'
    await setToken()

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

  test('Get', async () => {
    req.query = { id: organization.id }
    req.params = {}
    req.method = 'GET'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(200)

    // Get user data
    const user = await UserLib.get(adminUUID, [
      'firstname',
      'lastname',
      'email',
      'avatar'
    ])
    expect(resJson).toEqual({
      groups: [
        {
          id: group.id,
          name: 'Test group',
          users: [
            {
              id: adminUUID,
              ...user
            }
          ]
        }
      ]
    })

    // Error
    jest.spyOn(GroupLib, 'getByOrganization').mockImplementationOnce(() => {
      throw new Error('Get by organization error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get by organization error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Get by organization error')
    )
  })
})
