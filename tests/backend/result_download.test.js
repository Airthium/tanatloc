import path from 'path'

import route from '@/route/result/download'

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
      { workspace: { id: workspace.id }, project: { title: 'Test project' } }
    )
    simulation = await SimulationLib.add({
      project: { id: project.id },
      simulation: { name: 'Test simulation', scheme: {} }
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

describe('e2e/backend/result', () => {
  const req = {}
  let resStatus
  let resJson
  let resData
  const res = {
    on: jest.fn,
    once: jest.fn,
    emit: jest.fn,
    write: (data) => (resData = data),
    end: jest.fn,
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
    expect(resStatus).toBe(405)
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
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), fileName(string) } }'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { simulation: { id(uuid) }, result: { originPath(string), fileName(string) } }'
      )
    )

    // Create fake result file
    await Tools.writeFile(
      path.join(SIMULATION, simulation.id, 'path'),
      'test.vtu',
      'vtu'
    )

    // Normal
    req.body = {
      simulation: { id: simulation.id },
      result: { originPath: 'path', fileName: 'test.vtu' }
    }
    await route(req, res)
    await new Promise((resolve) => setTimeout(resolve, 200)) // Wait for pipe
    expect(resData).toEqual(Buffer.from('vtu'))

    // Error
    jest.spyOn(ResultLib, 'download').mockImplementationOnce(() => {
      throw new Error('Download error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Download error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Download error')
    )
  })
})
