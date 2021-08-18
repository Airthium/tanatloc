import route from '@/route/simulation/[id]'

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

describe('e2e/backend/simulation/id', () => {
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

    // Normal
    await route(req, res)
    expect(resStatus).toBe(200)
    const id = resJson.simulation.id
    expect(resJson).toEqual({
      simulation: {
        id: id,
        name: 'Test simulation',
        scheme: {},
        tasks: null
      }
    })

    // Error
    jest.spyOn(SimulationLib, 'get').mockImplementationOnce(() => {
      throw new Error('Get error')
    })
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Get error'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Get error')
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
      message: 'Missing data in your request (body(array))'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Missing data in your request (body(array))')
    )

    // Normal
    req.body = [{ key: 'name', value: 'Test simulation new' }]
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')

    const projectData = await SimulationLib.get(simulation.id, ['name'])
    expect(projectData).toEqual({
      id: simulation.id,
      name: 'Test simulation new'
    })

    // Error
    jest.spyOn(SimulationLib, 'update').mockImplementationOnce(() => {
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

    // Error
    jest.spyOn(SimulationLib, 'del').mockImplementationOnce(() => {
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
