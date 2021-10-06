import route from '@/pages/api/project'

import { initialize, clean, validUUID } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import WorkspaceLib from '@/lib/workspace'
import ProjectLib from '@/lib/project'

// Initialization
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

describe('e2e/backend/project', () => {
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

  test('Empty route', async () => {
    req.method = 'GET'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')
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
      message:
        'Missing data in your request (body: { workspace: { id(uuid) }, project: { title(string), description(?string) } }'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { workspace: { id(uuid) }, project: { title(string), description(?string) } }'
      )
    )

    // Access denied
    req.body = {
      workspace: { id: validUUID },
      project: { title: 'Test project' }
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Invalid workspace identifier'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Invalid workspace identifier')
    )

    // Normal
    req.body = {
      workspace: { id: workspace.id },
      project: { title: 'Test project' }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    const id = resJson.id
    expect(resJson).toEqual({
      id: id,
      title: 'Test project',
      description: '',
      owners: [adminUUID],
      workspace: workspace.id
    })

    // Error
    jest.spyOn(ProjectLib, 'add').mockImplementationOnce(() => {
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
})
