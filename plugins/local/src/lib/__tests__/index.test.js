import Local from '..'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('@/config/storage', () => ({}))

const mockUpdate = jest.fn()
jest.mock('@/database/simulation', () => ({
  update: async () => mockUpdate()
}))

const mockCreatePath = jest.fn()
const mockReadFile = jest.fn()
jest.mock('@/lib/tools', () => ({
  createPath: async () => mockCreatePath(),
  readFile: async () => mockReadFile()
}))

const mockRender = jest.fn()
jest.mock('@/lib/template', () => ({
  render: async () => mockRender()
}))

const mockGmsh = jest.fn()
const mockFreefem = jest.fn()
const mockToThree = jest.fn()
jest.mock('@/services', () => ({
  gmsh: async (path, mesh, geometry, callback) =>
    mockGmsh(path, mesh, geometry, callback),
  freefem: async (path, script, callback) =>
    mockFreefem(path, script, callback),
  toThree: async (path, fileIn, pathOut, callback) =>
    mockToThree(path, fileIn, pathOut, callback)
}))

describe('plugins/local/src/lib', () => {
  beforeEach(() => {
    mockPath.mockReset()
    mockUpdate.mockReset()

    mockCreatePath.mockReset()
    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => '{ "test": "test" }')

    mockRender.mockReset()
    mockGmsh.mockReset()
    mockFreefem.mockReset()
    mockToThree.mockReset()
  })

  it('key', () => {
    expect(Local.key).toBeDefined()
  })

  it('computeMesh', async () => {
    // Normal
    mockPath.mockImplementation(() => 'partPath')
    mockGmsh.mockImplementation(() => 0)
    mockToThree.mockImplementation((path, fileIn, pathOut, callback) => {
      callback({ pid: 'pid' })
      callback({ error: 'error' })
      callback({ data: 'data' })
      return 0
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
      part: 'part.json',
      partPath: 'partPath'
    })

    // Mesh convert error
    mockToThree.mockImplementation(() => {})
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
      mockToThree.mockImplementation(() => 0)
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
    mockFreefem.mockImplementation((path, script, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'PROCESS VTU FILE run/result.vtu\nreal log' })
      callback({ data: 'PROCESS DATA FILE run/data.dat\nreal log' })
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 0
    })
    mockGmsh.mockImplementation((path, mesh, geometry, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 0
    })
    mockToThree.mockImplementation((path, fileIn, partPath, callback) => {
      callback({ pid: 'pid' })
      callback({ data: 'file' })
      callback({ data: '{ "name": "name", "path": "path" }' })
      callback({ error: 'error' })
      return 0
    })

    // Empty
    await Local.computeSimulation('id', 'algorithm', {})

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
    mockToThree.mockImplementation(() => -1)
    mockReadFile.mockImplementation(() => {
      throw new Error()
    })
    await Local.computeSimulation('id', 'algorithm', {
      key: { file: {} }
    })

    mockToThree.mockImplementation(() => {
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
