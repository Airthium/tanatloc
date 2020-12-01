import Compute from '../compute'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('../../../config/storage', () => ({}))

const mockUpdate = jest.fn()
jest.mock('../../database/simulation', () => ({
  update: async () => mockUpdate()
}))

const mockRender = jest.fn()
jest.mock('../template', () => ({
  render: async () => mockRender()
}))

const mockGmsh = jest.fn()
const mockFreefem = jest.fn()
jest.mock('../../services', () => ({
  gmsh: async (path, mesh, geometry, callback) =>
    mockGmsh(path, mesh, geometry, callback),
  freefem: async (path, script, callback) => mockFreefem(path, script, callback)
}))

describe('src/lib/compute', () => {
  beforeEach(() => {
    mockPath.mockReset()
    mockUpdate.mockReset()
    mockRender.mockReset()
    mockGmsh.mockReset()
    mockFreefem.mockReset()
  })

  it('computeMesh', async () => {
    // Normal
    mockGmsh.mockImplementation(() => 0)
    const data = await Compute.computeMesh(
      'path',
      { file: 'file' },
      { path: 'path' }
    )
    expect(data).toEqual({
      file: 'file.msh',
      path: 'path'
    })

    // Error
    mockGmsh.mockReset()
    try {
      await Compute.computeMesh('path', { file: 'file' }, { path: 'path' })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })

  it('computeSimulation', async () => {
    mockFreefem.mockImplementation((path, script, callback) => {
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 0
    })
    mockGmsh.mockImplementation((path, mesh, geometry, callback) => {
      callback({ data: 'data' })
      callback({ error: 'data' })
      return 0
    })

    // Empty
    await Compute.computeSimulation('id', {})

    // With keys
    await Compute.computeSimulation('id', { key: {} })

    // With mesh
    await Compute.computeSimulation('id', {
      key: { meshable: true, file: {} }
    })

    // Date
    global.Date = {
      now: () => 0
    }
    await Compute.computeSimulation('id', {
      key: { meshable: true, file: {} }
    })

    // Mesh error
    mockGmsh.mockImplementation(() => -1)
    try {
      await Compute.computeSimulation('id', {
        key: { meshable: true, file: {} }
      })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }

    // Error
    mockGmsh.mockImplementation(() => 0)
    mockFreefem.mockReset()
    try {
      await Compute.computeSimulation('id', {})
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
