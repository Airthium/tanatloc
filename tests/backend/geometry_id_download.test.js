import fs, { promises as fspromises } from 'fs'

import route from '@/route/geometry/[id]/download'

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
  initialize()
    .then((res) => (adminUUID = res))
    .catch(console.error)
    .finally(() => {
      // Create workspace, project & geometry
      WorkspaceLib.add({ id: adminUUID }, { name: 'Test workspace' })
        .then((w) => {
          workspace = w
          ProjectLib.add(
            { id: adminUUID },
            {
              workspace: { id: workspace.id },
              project: {
                title: 'Test project',
                description: 'Test description'
              }
            }
          )
            .then((p) => {
              project = p
              const stepFile = fs.readFileSync('tests/assets/cube.step')
              GeometryLib.add({
                project: { id: project.id },
                geometry: {
                  name: 'name.step',
                  uid: 'uid',
                  buffer: Buffer.from(stepFile)
                }
              })
                .then((g) => {
                  geometry = g
                  done()
                })
                .catch(console.error)
            })
            .catch(console.error)
        })
        .catch(console.err)
    })
}, 0) // No timeout

// Clean
afterAll((done) => {
  clean()
    .catch((err) => console.error(err))
    .finally(done)
})

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/backend/geometry/[id]/download', () => {
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
    expect(resJson).toEqual({ message: 'Unauthorized' })
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

  test('Invalid id', async () => {
    req.query = { id: validUUID }
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Invalid geometry identifier'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Invalid geometry identifier')
    )
  })

  test('Wrong method', async () => {
    req.query = {}
    req.params = { id: geometry.id }
    req.method = 'method'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(405)
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

    const geometryPart = await GeometryLib.read({ id: geometry.id })
    expect(resJson).toEqual(geometryPart)

    // Error
    jest.spyOn(fspromises, 'readFile').mockImplementation(() => {
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
