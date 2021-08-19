import route from '@/route/workspace'

import { initialize, clean, validUUID } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import WorkspaceLib from '@/lib/workspace'
import UserLib from '@/lib/user'

// Initialize
let adminUUID
let workspace
beforeAll((done) => {
  new Promise(async (resolve) => {
    adminUUID = await initialize()
    workspace = await WorkspaceLib.add(
      { id: adminUUID },
      { name: 'Test workspace' }
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

describe('e2e/backend/workspace', () => {
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
  })

  test('Wrong method', async () => {
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
    req.method = 'GET'
    await setToken()

    const user = await UserLib.get(adminUUID, [
      'firstname',
      'lastname',
      'email',
      'avatar'
    ])

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      workspaces: [
        {
          id: workspace.id,
          name: 'Test workspace',
          owners: [user],
          users: null,
          groups: null,
          projects: []
        }
      ]
    })

    // Error
    jest.spyOn(WorkspaceLib, 'getByUser').mockImplementationOnce(() => {
      throw new Error('Get by user error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get by user error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Get by user error')
    )
  })

  test('Add', async () => {
    req.method = 'POST'
    await setToken()

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { name(string) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body: { name(string) })')
    )

    // Normal
    req.body = { name: 'Test workspace' }
    await route(req, res)
    expect(resStatus).toBe(200)
    const id = resJson.id
    expect(resJson).toEqual({
      id: id,
      name: 'Test workspace'
    })

    // Error
    jest.spyOn(WorkspaceLib, 'add').mockImplementationOnce(() => {
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
    await setToken()

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { workspace: { id(uuid) }, data(array) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { workspace: { id(uuid) }, data(array) })'
      )
    )

    // Access denied
    req.body = {
      workspace: { id: validUUID },
      data: [{ key: 'name', value: 'Test workspace new' }]
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Access denied')
    )

    // Normal
    req.body = {
      workspace: { id: workspace.id },
      data: [{ key: 'name', value: 'Test workspace new' }]
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    const workspaceData = await WorkspaceLib.get(workspace.id, ['name'])
    expect(workspaceData).toEqual({
      id: workspace.id,
      name: 'Test workspace new'
    })

    // Error
    jest.spyOn(WorkspaceLib, 'update').mockImplementationOnce(() => {
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
    await setToken()

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { id(uuid) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body: { id(uuid) })')
    )

    // Access denied
    req.body = { id: validUUID }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Access denied'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Access denied')
    )

    // Error
    req.body = { id: workspace.id }
    jest.spyOn(WorkspaceLib, 'del').mockImplementationOnce(() => {
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

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')
  })
})
