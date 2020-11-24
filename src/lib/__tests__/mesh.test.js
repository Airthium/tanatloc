import Mesh from '../mesh'

jest.mock('path', () => ({
  join: () => 'path'
}))

const mockRender = jest.fn()
jest.mock('../template', () => ({
  render: () => mockRender()
}))

const mockGmsh = jest.fn()
jest.mock('../../services', () => ({
  gmsh: () => mockGmsh()
}))

describe('src/lib/mesh', () => {
  beforeEach(() => {
    mockRender.mockReset(), mockGmsh.mockReset()
  })

  it('build', async () => {
    await Mesh.build('path', {}, {})
    expect(mockRender).toHaveBeenCalledTimes(1)
    expect(mockGmsh).toHaveBeenCalledTimes(1)
  })
})
