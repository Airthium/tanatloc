import Local from '..'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockSetInterval = jest.fn()
jest.mock('set-interval-async/fixed', () => ({
  setIntervalAsync: (func) => mockSetInterval(func)
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

    mockSetInterval.mockReset()

    mockUpdate.mockReset()

    mockConvert.mockReset()
    mockCreatePath.mockReset()
    mockReadFile.mockReset()

    mockRender.mockReset()
    mockGmsh.mockReset()
    mockFreefem.mockReset()
  })

  test('key', () => {
    expect(Local.key).toBeDefined()
  })

  test('computeMesh', async () => {
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
      { path: 'path', name: 'name', file: 'file' },
      { path: 'path' },
      jest.fn()
    )
    expect(data).toEqual({
      type: 'mesh',
      originPath: 'path',
      renderPath: 'path',
      fileName: 'name.msh',
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
        { path: 'path', name: 'name', file: 'file' },
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
        { path: 'path', name: 'name', file: 'file' },
        { path: 'path' },
        jest.fn()
      )
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  test('computeSimulation', async () => {
    mockFreefem.mockImplementation((path, script, callback) => {
      callback({ pid: 'pid' })
      callback({ error: 'data' })
      return 0
    })

    // Empty
    await Local.computeSimulation('id', 'algorithm', {})

    // Simulation error
    Date.now = () => 0
    mockFreefem.mockImplementation((path, file, callback) => {
      callback({})
      return 1
    })
    try {
      await Local.computeSimulation('id', 'algorithm', {})
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    //With meshes
    Date.now = () => NaN
    mockFreefem.mockImplementation(() => {
      return 0
    })
    mockGmsh.mockImplementation((path, mesh, geometry, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 0
    })
    mockConvert.mockImplementation(() => ({}))
    await Local.computeSimulation('id', 'algorithm', {
      geometry: {
        meshable: true,
        name: 'name',
        path: 'path',
        file: 'file'
      },
      geometry2: {
        meshable: false,
        name: 'name',
        path: 'path',
        file: 'file'
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
    Date.now = () => 0
    mockGmsh.mockImplementation((path, mesh, geometry, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 1
    })
    try {
      await Local.computeSimulation('id', 'algorithm', {
        geometry: {
          meshable: true,
          file: {
            originPath: 'originPath',
            fileName: 'fileName'
          }
        },
        geometry2: {
          meshable: false
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
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    // With results & data, read error
    let processOutput
    mockSetInterval.mockImplementation((func) => {
      processOutput = func
      return 1
    })
    mockFreefem.mockImplementation((path, file, callback) => {
      callback({})
      callback({})
      return 0
    })
    mockGmsh.mockImplementation(() => 0)
    mockReadFile.mockImplementation(() => {
      throw new Error()
    })
    await Local.computeSimulation('id', 'algorithm', {})
    await processOutput()

    // With results & data
    JSON.parse = () => ({})
    mockReadFile.mockImplementation(
      () => 'PROCESS VTU FILE Result.vtu\nPROCESS DATA FILE data.dat'
    )
    mockConvert.mockImplementation((path, file, callback) => {
      callback({ data: 'data' })
    })
    await processOutput()

    // With same results & data
    await processOutput()

    // Convert stderr
    JSON.parse = () => {
      throw new Error()
    }
    mockReadFile.mockImplementation(
      () => 'PROCESS VTU FILE Result1.vtu\nPROCESS DATA FILE data1.dat'
    )
    mockConvert.mockImplementation((path, file, callback) => {
      callback({ error: 'error' })
    })
    await processOutput()

    // Convert error
    mockReadFile.mockImplementation(
      () => 'PROCESS VTU FILE Result2.vtu\nPROCESS DATA FILE data2.dat'
    )
    mockConvert.mockImplementation(() => {
      throw new Error()
    })
    await processOutput()
  })

  test('stop', async () => {
    const mockKill = jest.spyOn(process, 'kill').mockImplementation(() => {})
    await Local.stop([{ status: 'wait' }, { status: 'process' }])
    expect(mockKill).toHaveBeenCalledTimes(1)
  })
})
