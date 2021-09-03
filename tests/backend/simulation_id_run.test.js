import fs from 'fs'

import route from '@/pages/api/simulation/[id]/run'

import { initialize, clean, validUUID } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import WorkspaceLib from '@/lib/workspace'
import ProjectLib from '@/lib/project'
import GeometryLib from '@/lib/geometry'
import SimulationLib from '@/lib/simulation'
import UserLib from '@/lib/user'

// Initialization
let adminUUID
let workspace
let project
let geometry
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
    simulation = await SimulationLib.add(
      {
        id: project.id
      },
      {
        name: 'Test simulation',
        scheme: {
          algorithm: 'poisson',
          configuration: {
            geometry: {
              index: 1,
              title: 'Geometry',
              meshable: true,
              value: geometry.id
            },
            parameters: {
              index: 2,
              title: 'Parameters',
              rightHandSide: {
                label: 'Right hand side',
                children: [
                  {
                    label: 'External force',
                    htmlEntity: 'formula',
                    default: 0
                  }
                ]
              },
              finiteElementSpace: {
                advanced: true,
                label: 'Finite element space',
                children: [
                  {
                    label: 'u',
                    htmlEntity: 'select',
                    options: [
                      {
                        label: 'P1',
                        value: 'P1'
                      },
                      {
                        label: 'P2',
                        value: 'P2'
                      }
                    ],
                    default: 'P1'
                  }
                ]
              },
              solver: {
                advanced: true,
                label: 'Solver',
                children: [
                  {
                    label: 'System resolution',
                    htmlEntity: 'select',
                    options: [
                      { label: 'GMRES', value: 'GMRES' },
                      { label: 'MUMPS', value: 'MUMPS' },
                      { label: 'UMFPACK', value: 'UMFPACK' }
                    ],
                    default: 'MUMPS'
                  }
                ]
              }
            },
            boundaryConditions: {
              index: 3,
              title: 'Boundary conditions',
              dirichlet: {
                label: 'Dirichlet',
                children: [
                  {
                    label: 'u',
                    default: 0
                  }
                ]
              },
              neumann: {
                label: 'Neumann',
                children: [
                  {
                    label: 'du/dn',
                    default: 0
                  }
                ]
              }
            },
            run: {
              index: 4,
              title: 'Run',
              results: [
                {
                  name: 'u'
                }
              ],
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

describe('e2e/backend/simulation/id/run', () => {
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

  test('Run', async () => {
    req.query = { id: simulation.id }
    req.method = 'GET'
    await setToken()

    // User
    await UserLib.update({ id: adminUUID }, [
      { key: 'authorizedplugins', value: ['local'] }
    ])

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual({ ok: true })

    // Error
    jest.spyOn(SimulationLib, 'run').mockImplementationOnce(() => {
      throw new Error('Run error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Run error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Run error')
    )
  })
})
