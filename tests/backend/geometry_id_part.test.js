import fs, { promises as fspromises } from 'fs'

import route from '@/pages/api/geometry/[id]/part'

import { initialize, clean, validUUID } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import WorkspaceLib from '@/lib/workspace'
import ProjectLib from '@/lib/project'
import GeometryLib from '@/lib/geometry'

// Initialize
let adminUUID
let workspace
let project
let geometry
beforeAll((done) => {
  new Promise(async (resolve) => {
    adminUUID = await initialize()
    workspace = await WorkspaceLib.add(
      { id: adminUUID },
      { name: 'Test workspace' }
    )
    project = await ProjectLib.add(
      { id: adminUUID },
      {
        id: workspace.id
      },
      {
        title: 'Test project',
        description: 'Test description'
      }
    )
    const stepFile = fs.readFileSync('tests/assets/cube.step')
    geometry = await GeometryLib.add(
      {
        id: project.id
      },
      {
        name: 'name.step',
        uid: 'uid',
        buffer: Buffer.from(stepFile)
      }
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

describe('e2e/backend/geometry/[id]/part', () => {
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
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (query: { id(string) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (query: { id(string) })')
    )
  })

  test('Invalid id', async () => {
    req.query = { id: validUUID }
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message: 'Invalid geometry identifier'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Invalid geometry identifier')
    )
  })

  test('Access denied', async () => {
    req.query = { id: geometry.id }
    await setToken()

    jest.spyOn(ProjectLib, 'get').mockImplementationOnce(() => ({
      owners: ['id'],
      users: [],
      groups: [],
      workspace: 'id'
    }))
    jest.spyOn(WorkspaceLib, 'get').mockImplementationOnce(() => ({
      owners: ['id'],
      users: [],
      groups: []
    }))

    await route(req, res)
    expect(resStatus).toBe(403)
    expect(resJson).toEqual({ error: true, message: 'Access denied' })
  })

  test('Wrong method', async () => {
    req.query = {}
    req.params = { id: geometry.id }
    req.method = 'method'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(402)
    expect(resJson).toEqual({
      error: true,
      message: 'Method method not allowed'
    })
  })

  test('Get', async () => {
    req.query = { id: geometry.id }
    req.method = 'GET'
    await setToken()

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)

    const geometryPart = await GeometryLib.readPart({ id: geometry.id })
    expect(resJson).toEqual(geometryPart)

    // Error
    jest.spyOn(fspromises, 'readFile').mockImplementationOnce(() => {
      throw new Error('Unable to read')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Unable to read' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Unable to read')
    )
  })
})
