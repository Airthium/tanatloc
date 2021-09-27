Date.now = () => 0

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
  clearIntervalAsync: () => {
    /**/
  }
}))

jest.mock('@/config/storage', () => ({}))

const mockUpdate = jest.fn()
jest.mock('@/database/simulation', () => ({
  update: async () => mockUpdate()
}))

const mockGmsh = jest.fn()
const mockFreefem = jest.fn()
jest.mock('@/services', () => ({
  gmsh: async (path, mesh, geometry, callback) =>
    mockGmsh(path, mesh, geometry, callback),
  freefem: async (path, script, callback) => mockFreefem(path, script, callback)
}))

const mockCreatePath = jest.fn()
const mockReadFile = jest.fn()
const mockConvert = jest.fn()
const mockRemoveFile = jest.fn()
const mockRemoveDirectory = jest.fn()
jest.mock('@/lib/tools', () => ({
  createPath: async () => mockCreatePath(),
  readFile: async () => mockReadFile(),
  convert: async (path, file, callback, param) =>
    mockConvert(path, file, callback, param),
  removeFile: async () => mockRemoveFile(),
  removeDirectory: async () => mockRemoveDirectory()
}))

const mockRender = jest.fn()
jest.mock('@/lib/template', () => ({
  render: async () => mockRender()
}))

describe('plugins/local/src/lib', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockSetInterval.mockReset()

    mockUpdate.mockReset()

    mockConvert.mockReset()
    mockCreatePath.mockReset()
    mockReadFile.mockReset()
    mockRemoveFile.mockReset()
    mockRemoveDirectory.mockReset()

    mockRender.mockReset()
    mockGmsh.mockReset()
    mockFreefem.mockReset()
  })

  test('key', () => {
    expect(Local.key).toBeDefined()
  })

  test('updateTasks', () => {
    Local.updateTasks('id', [])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  test('clean', async () => {
    // Normal
    await Local.clean('path')
    expect(mockRemoveFile).toHaveBeenCalledTimes(2)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(1)

    // Error
    mockRemoveFile.mockImplementation(() => {
      throw new Error('removeFile error')
    })
    mockRemoveDirectory.mockImplementation(() => {
      throw new Error('removeDirectory error')
    })
    await Local.clean('path')
    expect(mockRemoveFile).toHaveBeenCalledTimes(4)
    expect(mockRemoveDirectory).toHaveBeenCalledTimes(2)
  })

  test('startProcess', () => {
    const update = jest.fn()
    mockSetInterval.mockImplementation((callback) => {
      callback()
      return 'interval'
    })
    mockReadFile.mockImplementation(() => {
      throw new Error('no file')
    })
    Local.stopProcess('id', 'path', {}, update)

    const interval = Local.startProcess('id', 'path', {}, update)
    expect(interval).toBe('interval')

    Local.startProcess('id', 'path', {}, update)
  })

  test('stopProcess', () => {
    const update = jest.fn()
    mockReadFile.mockImplementation(() => {
      throw new Error('no file')
    })

    Local.stopProcess('id', 'path', {}, update)
  })

  test('processResult', async () => {
    const update = jest.fn()
    mockSetInterval.mockImplementation((callback) => {
      callback()
      return 'interval'
    })
    mockReadFile.mockImplementation(() => 'PROCESS VTU FILE Result.vtu')
    Local.startProcess('id', 'path', {}, update)

    // Convert error
    mockConvert.mockImplementation(() => {
      throw new Error('Convert errror')
    })
    await Local.stopProcess('id', 'path', {}, update)

    // Convert error message
    mockConvert.mockImplementation((_, __, callback) => {
      callback({ error: 'Convert error' })
    })
    await Local.stopProcess('id', 'path', {}, update)

    // Ok
    mockConvert.mockImplementation((_, __, callback) => {
      callback({ data: JSON.stringify({ name: 'name', apth: 'path' }) })
    })
    await Local.stopProcess('id', 'path', {}, update)

    await Local.stopProcess('id', 'path', {}, update)
  })

  test('processData', async () => {
    const update = jest.fn()
    mockSetInterval.mockImplementation((callback) => {
      callback()
      return 'interval'
    })
    mockReadFile.mockImplementation(() => 'PROCESS DATA FILE data.dat')
    Local.startProcess('id', 'path', {}, update)

    // Error
    await Local.stopProcess('id', 'path', {}, update)

    // Ok
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 3) return JSON.stringify({ t: 0, x: 1 })
      return 'PROCESS DATA FILE data.dat'
    })
    await Local.stopProcess('id', 'path', {}, update)
    await Local.stopProcess('id', 'path', {}, update)
  })

  test('computeMesh', async () => {
    // Normal
    mockPath.mockImplementation(() => 'partPath')
    mockGmsh.mockImplementation((_, __, ___, callback) => {
      callback({})
      return 0
    })
    mockConvert.mockImplementation((_, __, callback) => {
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
    mockFreefem.mockImplementation((_, __, callback) => {
      callback({ pid: 'pid' })
      callback({ error: 'data' })
      return 0
    })
    mockReadFile.mockImplementation(() => '')

    // Empty
    await Local.computeSimulation('id', 'algorithm', {})

    // Simulation error
    mockFreefem.mockImplementation((_, __, callback) => {
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
    mockFreefem.mockImplementation(() => {
      return 0
    })
    mockGmsh.mockImplementation((_, __, ___, callback) => {
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

    // Coupling
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
      initialization: {
        value: {
          type: 'coupling'
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
    mockGmsh.mockImplementation((_, __, ___, callback) => {
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
  })

  test('stop', async () => {
    const mockKill = jest.spyOn(process, 'kill').mockImplementation(() => {})
    await Local.stop('id', [
      { status: 'finish' },
      { status: 'wait' },
      { pid: 'pid', status: 'process' }
    ])
    expect(mockKill).toHaveBeenCalledTimes(1)
  })
})
