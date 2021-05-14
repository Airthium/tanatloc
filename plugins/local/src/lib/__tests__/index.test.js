import Local from '..'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('set-interval-async/fixed', () => ({
  setIntervalAsync: (func) => {
    func()
    return 1
  }
}))

jest.mock('set-interval-async', () => ({
  clearIntervalAsync: () => {}
}))

jest.mock('@/config/storage', () => ({}))

const mockUpdate = jest.fn()
jest.mock('@/database/simulation', () => ({
  update: async () => mockUpdate()
}))

const mockCreatePath = jest.fn()
const mockReadFile = jest.fn()
const mockConvert = jest.fn()
jest.mock('@/lib/tools', () => ({
  createPath: async () => mockCreatePath(),
  readFile: async () => mockReadFile(),
  convert: async (path, file, callback, param) =>
    mockConvert(path, file, callback, param)
}))

const mockRender = jest.fn()
jest.mock('@/lib/template', () => ({
  render: async () => mockRender()
}))

const mockGmsh = jest.fn()
const mockFreefem = jest.fn()
jest.mock('@/services', () => ({
  gmsh: async (path, mesh, geometry, callback) =>
    mockGmsh(path, mesh, geometry, callback),
  freefem: async (path, script, callback) => mockFreefem(path, script, callback)
}))

describe('plugins/local/src/lib', () => {
  beforeEach(() => {
    mockPath.mockReset()
    mockUpdate.mockReset()

    mockConvert.mockReset()
    mockCreatePath.mockReset()
    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => '{ "test": "test" }')

    mockRender.mockReset()
    mockGmsh.mockReset()
    mockFreefem.mockReset()
  })

  it('key', () => {
    expect(Local.key).toBeDefined()
  })

  it('computeMesh', async () => {
    // Normal
    mockPath.mockImplementation(() => 'partPath')
    mockGmsh.mockImplementation(() => 0)
    mockConvert.mockImplementation((path, file, callback) => {
      callback({})
      return {
        json: 'json',
        glb: 'glb'
      }
    })
    const data = await Local.computeMesh(
      'path',
      { file: 'file' },
      { path: 'path' },
      jest.fn()
    )
    expect(data).toEqual({
      originPath: 'path',
      renderPath: 'path',
      fileName: 'file.msh',
      json: 'json',
      glb: 'glb'
    })

    // Mesh convert error
    mockConvert.mockImplementation(() => {
      throw new Error()
    })
    try {
      await Local.computeMesh(
        'path',
        { file: 'file' },
        { path: 'path' },
        jest.fn()
      )
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      mockConvert.mockImplementation(() => ({}))
    }

    // Error
    mockGmsh.mockReset()
    try {
      await Local.computeMesh(
        'path',
        { file: 'file' },
        { path: 'path' },
        jest.fn()
      )
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('computeSimulation', async () => {
    mockReadFile.mockImplementation(
      () =>
        'PROCESS VTU FILE run/result.vtu\nreal log\nPROCESS DATA FILE run/data.dat\nreal log'
    )
    mockFreefem.mockImplementation((path, script, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 0
    })
    mockConvert.mockImplementation((path, file, callback) => {
      callback({ data: JSON.stringify({ path: 'path' }) })
      return {
        json: 'json',
        glb: 'glb'
      }
    })

    // Empty
    await Local.computeSimulation('id', 'algorithm', {})

    // Convert stderr
    mockConvert.mockImplementation((path, file, callback) => {
      callback({ error: 'error' })
      return {
        json: 'json',
        glb: 'glb'
      }
    })
    await Local.computeSimulation('id', 'algorithm', {})

    // Convert error
    mockConvert.mockImplementation(() => {
      throw new Error()
    })
    JSON.parse = () => {
      throw new Error()
    }
    await Local.computeSimulation('id', 'algorithm', {})

    // With meshes
    JSON.parse = () => ({})
    mockGmsh.mockImplementation((path, mesh, geometry, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 0
    })
    mockConvert.mockImplementation(() => ({
      json: 'json',
      glb: 'glb'
    }))
    await Local.computeSimulation('id', 'algorithm', {
      geometry: {
        meshable: true,
        file: {
          originPath: 'originPath',
          fileName: 'fileName'
        }
      },
      boundaryConditions: {
        index: 0,
        key1: {},
        key2: {
          values: [
            {
              selected: [1]
            }
          ],
          refineFactor: 5
        }
      }
    })

    // Meshing error
    mockGmsh.mockImplementation(() => {
      throw new Error()
    })
    try {
      await Local.computeSimulation('id', 'algorithm', {
        geometry: {
          meshable: true,
          file: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        }
      })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      mockGmsh.mockImplementation(() => 0)
    }

    // Simulating error
    mockFreefem.mockImplementation(() => 1)
    try {
      await Local.computeSimulation('id', 'algorithm', {})
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      mockFreefem.mockImplementation(() => 0)
    }

    // Data
    global.Date = {
      now: () => 0
    }
    await Local.computeSimulation('id', 'algorithm', {
      geometry: {
        meshable: true,
        file: {
          originPath: 'originPath',
          fileName: 'fileName'
        }
      }
    })

    // With keys
    await Local.computeSimulation('id', 'algorithm', { key: {} })
    // With mesh
    await Local.computeSimulation('id', 'algorithm', {
      key: { meshable: true, file: {} }
    })
    // With boundary condition (empty)
    await Local.computeSimulation('id', 'algorithm', {
      key: { meshable: true, file: {} },
      boundaryConditions: {
        index: 2,
        key: {}
      }
    })
    // With refinement
    await Local.computeSimulation('id', 'algorithm', {
      key: { meshable: true, file: {} },
      boundaryConditions: {
        key: {
          refineFactor: 2,
          values: [
            {
              selected: ['uuid']
            }
          ]
        }
      }
    })
    // Date
    global.Date = {
      now: () => 0
    }
    await Local.computeSimulation('id', 'algorithm', {
      key: { meshable: true, file: {} }
    })
    global.Date = {
      now: () => Math.random()
    }
    await Local.computeSimulation('id', 'algorithm', {
      key: { meshable: true, file: {} }
    })
    // Mesh error
    mockGmsh.mockImplementation(() => -1)
    try {
      await Local.computeSimulation('id', 'algorithm', {
        key: { meshable: true, file: {} }
      })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
    // Result & data error
    mockConvert.mockImplementation(() => {
      throw new Error()
    })
    mockReadFile.mockImplementation(() => {
      throw new Error()
    })
    await Local.computeSimulation('id', 'algorithm', {
      key: { file: {} }
    })
    mockConvert.mockImplementation(() => {
      throw new Error()
    })
    await Local.computeSimulation('id', 'algorithm', {
      key: { file: {} }
    })
    // Error
    mockGmsh.mockImplementation(() => 0)
    mockFreefem.mockReset()
    try {
      await Local.computeSimulation('id', 'algorithm', {})
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('stop', async () => {
    const mockKill = jest.spyOn(process, 'kill').mockImplementation(() => {})
    await Local.stop([{ status: 'wait' }, { status: 'process' }])
    expect(mockKill).toHaveBeenCalledTimes(1)
  })
})
