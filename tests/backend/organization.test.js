import route from '@/route/organization'

import { initialize, clean, validUUID } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import OrganizationLib from '@/lib/organization'
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

describe('e2e/backend/organization', () => {
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

  test('Add', async () => {
    req.method = 'POST'
    await setToken()

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { name(string) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body: { name(string) })')
    )

    // Normal
    req.body = {
      name: 'Test organization'
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    const organizationId = resJson.id
    expect(resJson).toEqual({ id: organizationId })

    const organization = await OrganizationLib.get(organizationId, [
      'name',
      'owners',
      'users',
      'groups'
    ])
    expect(organization).toEqual({
      id: organizationId,
      name: 'Test organization',
      owners: [adminUUID],
      users: null,
      groups: null
    })

    const user = await UserLib.get(adminUUID, ['organizations'])
    expect(user).toEqual({
      id: adminUUID,
      organizations: [organization.id]
    })

    // Error
    jest.spyOn(OrganizationLib, 'add').mockImplementationOnce(() => {
      throw new Error('Add error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Add error' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Add error')
    )
  })

  test('Update', async () => {
    await setToken()

    // Add organization
    req.method = 'POST'
    req.body = {
      name: 'Test organization'
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    const organization = resJson

    req.method = 'PUT'

    // Wrong body
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

    // Normal
    req.body = {
      id: organization.id,
      data: [{ key: 'name', value: 'new name' }]
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')
    const organizationData = await OrganizationLib.get(organization.id, [
      'name'
    ])
    expect(organizationData).toEqual({
      id: organization.id,
      name: 'new name'
    })

    // Error
    jest.spyOn(OrganizationLib, 'update').mockImplementationOnce(() => {
      throw new Error('Update error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Update error' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Update error')
    )

    // Unauthorized
    req.body = {
      id: validUUID,
      data: [{ key: 'name', value: 'new name' }]
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Invalid organization identifier'
    })
  })

  test('Delete', async () => {
    await setToken()

    // Add organization
    req.method = 'POST'
    req.body = {
      name: 'Test organization'
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    const organization = resJson

    req.method = 'DELETE'

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body: { id(uuid) })')
    )

    // Normal
    req.body = { id: organization.id }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    const organizationData = await OrganizationLib.get(organization.id, [
      'name'
    ])
    expect(organizationData).not.toBeDefined()

    // Error
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Invalid organization identifier'
    })
  })
})
