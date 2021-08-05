import fs from 'fs'

import route from '@/route/geometry/[id]'

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
})

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

describe('e2e/backend/geometry/[id]', () => {
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

  //TODO

  // test('Get geometry', async () => {
  //   req.query = { id: 'id' }
  //   req.method = 'GET'
  //   await setToken()

  //   // Normal
  //   mockQuery.mockImplementation((command) => {
  //     if (
  //       command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1'
  //     )
  //       return { rows: [{ id: 'id', owners: ['id'] }] }

  //     return { rows: [{ id: 'id' }] }
  //   })
  //   await route(req, res)
  //   expect(resStatus).toBe(200)
  //   expect(resJson).toEqual({ geometry: { id: 'id' } })

  //   // Error
  //   mockQuery.mockImplementation((command) => {
  //     if (
  //       command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups FROM tanatloc_workspaces WHERE id = $1'
  //     )
  //       return { rows: [{ id: 'id', owners: ['id'] }] }

  //     throw new Error('query error')
  //   })
  //   await route(req, res)
  //   expect(resStatus).toBe(500)
  //   expect(resJson).toEqual({ error: true, message: 'query error' })
  //   expect(mockCaptureException).toHaveBeenLastCalledWith(
  //     new Error('query error')
  //   )
  // })

  // test('Update geometry', async () => {
  //   req.query = { id: 'id' }
  //   req.method = 'PUT'
  //   await setToken()

  //   // Wrong data
  //   mockQuery.mockImplementation((command) => {
  //     if (
  //       command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1'
  //     )
  //       return { rows: [{ id: 'id', owners: ['id'] }] }

  //     return { rows: [{ id: 'id' }] }
  //   })
  //   await route(req, res)
  //   expect(resStatus).toBe(500)
  //   expect(resJson).toEqual({
  //     error: true,
  //     message: 'Missing data in your request (body(array))'
  //   })
  //   expect(mockCaptureException).toHaveBeenLastCalledWith(
  //     new Error('Missing data in your request (body(array))')
  //   )

  //   // Normal
  //   req.body = [{ key: 'key', value: 'value' }]
  //   await route(req, res)
  //   expect(resStatus).toBe(200)
  //   expect(resJson).toEqual('end')
  //   expect(mockQuery).toHaveBeenLastCalledWith(
  //     'UPDATE tanatloc_geometries SET key = $2 WHERE id = $1',
  //     ['id', 'value']
  //   )

  //   // Error
  //   mockQuery.mockImplementation((command) => {
  //     if (
  //       command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups FROM tanatloc_workspaces WHERE id = $1'
  //     )
  //       return { rows: [{ id: 'id', owners: ['id'] }] }

  //     throw new Error('query error')
  //   })
  //   await route(req, res)
  //   expect(resStatus).toBe(500)
  //   expect(resJson).toEqual({ error: true, message: 'query error' })
  //   expect(mockCaptureException).toHaveBeenLastCalledWith(
  //     new Error('query error')
  //   )
  // })

  // test('Delete geometry', async () => {
  //   req.query = { id: 'id' }
  //   req.method = 'DELETE'
  //   await setToken()

  //   // Normal
  //   mockQuery.mockImplementation((command) => {
  //     if (
  //       command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1'
  //     )
  //       return { rows: [{ id: 'id', owners: ['id'] }] }

  //     return { rows: [{ id: 'id' }] }
  //   })
  //   await route(req, res)
  //   expect(mockQuery).toHaveBeenNthCalledWith(
  //     4,
  //     'SELECT extension,uploadfilename,glb,json,project FROM tanatloc_geometries WHERE id = $1',
  //     ['id']
  //   )
  //   expect(mockQuery).toHaveBeenNthCalledWith(
  //     5,
  //     'UPDATE tanatloc_projects SET geometries = array_remove(geometries, $1)',
  //     ['id']
  //   )
  //   expect(mockQuery).toHaveBeenNthCalledWith(
  //     6,
  //     'DELETE FROM tanatloc_geometries WHERE id = $1',
  //     ['id']
  //   )
  //   expect(resStatus).toBe(200)
  //   expect(resJson).toEqual('end')

  //   // With uploadfilename, glb & json
  //   mockQuery.mockClear()
  //   mockQuery.mockImplementation((command) => {
  //     if (
  //       command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups FROM tanatloc_workspaces WHERE id = $1'
  //     )
  //       return { rows: [{ id: 'id', owners: ['id'] }] }
  //     else if (
  //       command ===
  //       'SELECT extension,uploadfilename,glb,json,project FROM tanatloc_geometries WHERE id = $1'
  //     )
  //       return {
  //         rows: [
  //           {
  //             id: 'id',
  //             uploadfilename: 'uploadfilename',
  //             glb: 'glb',
  //             json: 'json'
  //           }
  //         ]
  //       }
  //     return { rows: [{ id: 'id' }] }
  //   })
  //   await route(req, res)
  //   expect(mockUnlink).toHaveBeenNthCalledWith(
  //     1,
  //     '/home/simon/tanatloc/geometry/uploadfilename'
  //   )
  //   expect(mockUnlink).toHaveBeenNthCalledWith(
  //     2,
  //     '/home/simon/tanatloc/geometry/glb'
  //   )
  //   expect(mockRm).toHaveBeenLastCalledWith(
  //     '/home/simon/tanatloc/geometry/json'
  //   )
  //   expect(resStatus).toBe(200)
  //   expect(resJson).toEqual('end')

  //   // unlink & rm errors
  //   mockUnlink.mockImplementation(() => {
  //     throw new Error('unlink error')
  //   })
  //   mockRm.mockImplementation(() => {
  //     throw new Error('rm error')
  //   })
  //   await route(req, res)
  //   expect(resStatus).toBe(200)
  //   expect(resJson).toEqual('end')

  //   // Error
  //   mockQuery.mockImplementation((command) => {
  //     if (
  //       command === 'SELECT project FROM tanatloc_geometries WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups,workspace FROM tanatloc_projects WHERE id = $1' ||
  //       command ===
  //         'SELECT owners,users,groups FROM tanatloc_workspaces WHERE id = $1'
  //     )
  //       return { rows: [{ id: 'id', owners: ['id'] }] }

  //     throw new Error('query error')
  //   })
  //   await route(req, res)
  //   expect(resStatus).toBe(500)
  //   expect(resJson).toEqual({ error: true, message: 'query error' })
  //   expect(mockCaptureException).toHaveBeenLastCalledWith(
  //     new Error('query error')
  //   )
  // })
})
