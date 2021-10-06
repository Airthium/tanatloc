import route from '@/pages/api/group'

import { initialize, clean } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import OrganizationLib from '@/lib/organization'
import GroupLib from '@/lib/group'

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

describe('e2e/backend/group', () => {
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

    // No body
    req.body = undefined
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
      )
    )

    // No organization
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
      )
    )

    // No organization id
    req.body = {
      organization: {}
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
      )
    )

    // No group
    req.body = {
      organization: { id: organization.id }
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
      )
    )

    // No group name
    req.body = {
      organization: { id: organization.id },
      group: {}
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
      )
    )

    // No group users
    req.body = {
      organization: { id: organization.id },
      group: { name: 'name' }
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { organization: { id(uuid) }, group: { name(string), users(array) } })'
      )
    )

    // Normal
    req.body = {
      organization: { id: organization.id },
      group: { name: 'name', users: [adminUUID] }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    const groupId = resJson.id
    expect(resJson).toEqual({
      id: groupId,
      name: 'name',
      organization: organization.id,
      users: [adminUUID]
    })

    const groupData = await GroupLib.get(
      groupId,
      ['name', 'users', 'workspaces', 'projects', 'organization'],
      false
    )
    expect(groupData).toEqual({
      id: groupId,
      name: 'name',
      users: [adminUUID],
      workspaces: null,
      projects: null,
      organization: organization.id
    })

    // Error
    jest.spyOn(GroupLib, 'add').mockImplementationOnce(() => {
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

    // Add a group
    req.method = 'POST'
    req.body = {
      organization: { id: organization.id },
      group: { name: 'name', users: [adminUUID] }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    const groupId = resJson.id

    req.method = 'PUT'

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
    req.body = { id: groupId }
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
    req.body = { id: groupId, data: [{ key: 'name', value: 'new name' }] }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Error
    jest.spyOn(GroupLib, 'update').mockImplementationOnce(() => {
      throw new Error('Update error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Update error' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Update error')
    )
  })

  test('Delete', async () => {
    await setToken()

    // Add a group
    req.method = 'POST'
    req.body = {
      organization: { id: organization.id },
      group: { name: 'name', users: [adminUUID] }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    let groupId = resJson.id

    req.method = 'DELETE'

    // No body
    req.body = undefined
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body: { id(uuid) })')
    )

    // No id
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
    req.body = { id: groupId }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    // Add a group
    req.method = 'POST'
    req.body = {
      organization: { id: organization.id },
      group: { name: 'name', users: [adminUUID] }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    groupId = resJson.id

    req.method = 'DELETE'

    // Error
    req.body = { id: groupId }
    jest.spyOn(GroupLib, 'del').mockImplementationOnce(() => {
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
