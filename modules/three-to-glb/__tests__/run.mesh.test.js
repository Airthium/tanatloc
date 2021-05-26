jest.mock('path', () => ({
  join: () => 'path'
}))

const mockReadFile = jest.fn()
jest.mock('fs', () => ({
  readFileSync: () => mockReadFile()
}))

jest.mock('three/examples/js/exporters/GLTFExporter', () => {})
jest.mock('three/examples/js/math/Lut', () => {})
jest.mock('three/examples/js/utils/BufferGeometryUtils', () => {})

jest.mock('canvas', () => class {})

describe('modules/three-to-glb/run', () => {
  beforeEach(() => {
    mockReadFile.mockReset()
  })

  it('empty', () => {
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [1, 2, 3]
    })
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'mesh',
          solids: [{}],
          faces: [{}],
          edges: [{}]
        })
      return JSON.stringify({})
    })
    require('../run')
  })
})
