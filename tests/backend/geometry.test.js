import { promises as fs } from 'fs'

import route from '@/route/geometry'

import { initialize, clean } from '@/config/jest/e2e/global'

import { encryptSession } from '@/auth/iron'

import WorkspaceLib from '@/lib/workspace'
import ProjectLib from '@/lib/project'
import GeometryLib from '@/lib/geometry'

// Initialize
let adminUUID
let workspace
let project
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

describe('e2e/backend/geometry', () => {
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

  test('Empty route', async () => {
    req.method = 'GET'
    await setToken()

    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toEqual('end')
  })

  test('Add', async () => {
    req.method = 'POST'
    await setToken()

    // No body
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // No project id
    req.body = {
      project: {}
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    //  No geometry
    req.body = {
      project: { id: project.id }
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // No geometry name
    req.body = {
      project: { id: project.id },
      geometry: {}
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // No geometry uid
    req.body = {
      project: { id: project.id },
      geometry: { name: 'name.step' }
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // No geometry buffer
    req.body = {
      project: { id: project.id },
      geometry: { name: 'name.step', uid: 'uid' }
    }
    await route(req, res)
    expect(resStatus).toBe(400)
    expect(resJson).toEqual({
      error: true,
      message:
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
    })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error(
        'Missing data in your request (body: { project: { id(uuid) }, geometry: { name(string), uid(uuid), buffer(object) } })'
      )
    )

    // Error
    req.body = {
      project: { id: project.id },
      geometry: {
        name: 'name1.step',
        uid: 'uid1',
        buffer: Buffer.from('not a geometry')
      }
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({
      error: true,
      message: 'Conversion process failed.'
    })

    // Normal
    const stepFile = await fs.readFile('tests/assets/cube.step')
    req.body = {
      project: { id: project.id },
      geometry: {
        name: 'name2.step',
        uid: 'uid2',
        buffer: Buffer.from(stepFile)
      }
    }
    await route(req, res)
    expect(resStatus).toBe(200)
    const geometryId = resJson.id

    // Remove uuid for comparaison, unique at each run
    const resJsonCopy = JSON.parse(JSON.stringify(resJson))
    resJsonCopy.summary.solids.forEach((solid) => {
      delete solid.uuid
    })
    resJsonCopy.summary.faces.forEach((face) => {
      delete face.uuid
    })
    delete resJsonCopy.summary.uuid

    expect(resJsonCopy).toEqual({
      extension: 'step',
      glb: 'uid2.glb',
      id: geometryId,
      json: 'uid2',
      name: 'name2.step',
      originalfilename: 'name2.step',
      summary: {
        faces: [
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_1',
            number: '1'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_2',
            number: '2'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_3',
            number: '3'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_4',
            number: '4'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_5',
            number: '5'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_6',
            number: '6'
          }
        ],
        solids: [
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'solid_1',
            number: '1'
          }
        ],
        type: 'geometry'
      },
      uploadfilename: 'uid2.step'
    })

    // test dB entry and file
    const geometry = await GeometryLib.get(geometryId, [
      'name',
      'originalfilename',
      'extension',
      'uploadfilename',
      'glb',
      'json',
      'summary',
      'project'
    ])
    const geometryCopy = JSON.parse(JSON.stringify(geometry))
    geometryCopy.summary.solids.forEach((solid) => {
      delete solid.uuid
    })
    geometryCopy.summary.faces.forEach((face) => {
      delete face.uuid
    })
    delete geometryCopy.summary.uuid
    expect(geometryCopy).toEqual({
      extension: 'step',
      glb: 'uid2.glb',
      id: geometryId,
      json: 'uid2',
      name: 'name2.step',
      originalfilename: 'name2.step',
      project: project.id,
      summary: {
        faces: [
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_1',
            number: '1'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_2',
            number: '2'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_3',
            number: '3'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_4',
            number: '4'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_5',
            number: '5'
          },
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'face_6',
            number: '6'
          }
        ],
        solids: [
          {
            color: {
              b: 0.75,
              g: 0.75,
              r: 0.75
            },
            name: 'solid_1',
            number: '1'
          }
        ],
        type: 'geometry'
      },
      uploadfilename: 'uid2.step'
    })

    // Step
    const step = await GeometryLib.read({ id: geometryId })
    expect(step.extension).toBe('step')
    expect(step.buffer).toBeDefined()

    // Part (json & glb)
    const json = await GeometryLib.readPart({ id: geometryId })
    expect(json.uuid).toBeDefined()
    expect(json.buffer).toBeDefined()
  })
})
