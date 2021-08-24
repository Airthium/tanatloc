import path from 'path'

import route from '@/route/result'

import { initialize, clean } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import { SIMULATION } from '@/config/storage'

import WorkspaceLib from '@/lib/workspace'
import ProjectLib from '@/lib/project'
import SimulationLib from '@/lib/simulation'
import Tools from '@/lib/tools'
import ResultLib from '@/lib/result'

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
      { name: 'Test simulation', scheme: {} }
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

describe('e2e/backend/result', () => {
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

  test('Load', async () => {
    req.method = 'POST'
    await setToken()

    // Wrong body
    req.body = {}
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), glb(string) } }'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), glb(string) } }'
      )
    )

    // Create fake result file
    await Tools.writeFile(
      path.join(SIMULATION, simulation.id, 'path'),
      'glb',
      'glb'
    )

    // Normal
    req.body = {
      simulation: { id: simulation.id },
      result: { originPath: 'path', glb: 'glb' }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({
      buffer: Buffer.from('glb')
    })

    // Error
    jest.spyOn(ResultLib, 'load').mockImplementationOnce(() => {
      throw new Error('Load error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Load error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Load error')
    )
  })
})
