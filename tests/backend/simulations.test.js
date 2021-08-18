import route from '@/route/simulations'

import { initialize, clean, validUUID } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import WorkspaceLib from '@/lib/workspace'
import ProjectLib from '@/lib/project'
import SimulationLib from '@/lib/simulation'

// Initialize
let adminUUID
let workspace
let project
let simulation
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
        workspace: { id: workspace.id },
        project: {
          title: 'Test project',
          description: 'Test description'
        }
      }
    )
    simulation = await SimulationLib.add({
      project: { id: project.id },
      simulation: {
        name: 'Test simulation',
        scheme: {}
      }
    })
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

describe('e2e/backend/simulations', () => {
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

  test('No ids', async () => {
    req.method = 'POST'
    await setToken()

    // No body
    req.body = undefined
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Missing data in your request (body: { ids(?array) })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body: { ids(?array) })')
    )

    // No ids
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ simulations: [] })
  })

  test('with ids', async () => {
    req.body = { ids: [simulation.id, validUUID] }
    await setToken()
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson.simulations.length).toBe(1)
  })
})
