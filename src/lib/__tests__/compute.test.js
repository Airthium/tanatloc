import Compute from '../compute'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockRender = jest.fn()
jest.mock('../template', () => ({
  render: async () => mockRender()
}))

const mockGmsh = jest.fn()
const mockFreefem = jest.fn()
jest.mock('../../services', () => ({
  gmsh: async () => mockGmsh(),
  freefem: async () => mockFreefem()
}))

describe('src/lib/compute', () => {
  beforeEach(() => {
    mockPath.mockReset()
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
    mockFreefem.mockImplementation(() => 0)
    mockGmsh.mockImplementation(() => 0)

    // Empty
    await Compute.computeSimulation('id', 'path', {})

    // With keys
    await Compute.computeSimulation('id', 'path', { key: {} })

    // With mesh
    await Compute.computeSimulation('id', 'path', {
      key: { meshable: true, file: {} }
    })

    // Error
    mockFreefem.mockReset()
    try {
      await Compute.computeSimulation('id', 'path', {})
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
