/**
 * @jest-environment node
 */

import path from 'path'

import route from '@/route/result/archive'

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
      simulation: {
        name: 'Test simulation',
        scheme: {
          algorithm: 'algorithm',
          configuration: {
            geometry: {
              value: 'geometry'
            },
            material: {
              values: [
                {
                  material: {
                    label: 'material'
                  }
                }
              ]
            },
            parameters: {
              test: {
                label: 'test',
                children: [
                  {
                    label: 'test',
                    value: 'test'
                  }
                ]
              }
            },
            boundaryConditions: {
              test: {
                values: [
                  {
                    name: 'test',
                    type: {
                      label: 'test'
                    },
                    selected: [
                      {
                        label: '1'
                      }
                    ]
                  }
                ]
              }
            },
            run: {
              cloudServer: {
                name: 'cloudServer'
              }
            }
          }
        }
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
    setHeader: jest.fn,
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
        'Missing data in your request (body: { simulation: { id(uuid) } }'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { simulation: { id(uuid) } }'
      )
    )

    // Create fake result file
    await Tools.writeFile(
      path.join(SIMULATION, simulation.id, 'run', 'result'),
      'test.vtu',
      'vtu'
    )

    // Normal
    req.body = {
      simulation: { id: simulation.id }
    }
    await route(req, res)
    await new Promise((resolve) => setTimeout(resolve, 200)) // Wait for pipe
    expect(resData).toBeDefined()

    // Error
    jest.spyOn(ResultLib, 'archive').mockImplementationOnce(() => {
      throw new Error('Archive error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Archive error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Archive error')
    )
  })
})
