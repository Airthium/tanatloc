import route from '@/route/simulation/[id]/stop'

import { initialize, clean, validUUID } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import WorkspaceLib from '@/lib/workspace'
import ProjectLib from '@/lib/project'
import SimulationLib from '@/lib/simulation'

// Initialization
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
      { id: workspace.id },
      { title: 'Test project' }
    )
    simulation = await SimulationLib.add(
      { id: project.id },
      {
        name: 'Test simulation',
        scheme: {
          configuration: {
            run: {
              cloudServer: {
                key: 'local'
              }
            }
          }
        }
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

describe('e2e/backend/simulation/id/stop', () => {
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
      message: 'Invalid simulation identifier'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Invalid simulation identifier')
    )
  })

  test('Wrong method', async () => {
    req.query = { id: simulation.id }
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

  test('Stop', async () => {
    req.query = { id: simulation.id }
    req.method = 'GET'
    await setToken()

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ ok: true })

    // Error
    jest.spyOn(SimulationLib, 'stop').mockImplementationOnce(() => {
      throw new Error('Stop error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Stop error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Stop error')
    )
  })
})
