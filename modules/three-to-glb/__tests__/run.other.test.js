/**
 * @jest-environment node
 */

jest.mock('path', () => ({
  join: () => 'path'
}))

const mockReadFile = jest.fn()
jest.mock('fs', () => ({
  readFileSync: () => mockReadFile()
}))

jest.mock('three/examples/js/exporters/GLTFExporter', () => {
  // mock module
})
jest.mock('three/examples/js/math/Lut', () => {
  // mock module
})
jest.mock('three/examples/js/utils/BufferGeometryUtils', () => {
  // mock module
})

jest.mock('canvas', () => class {})

describe('modules/three-to-glb/run', () => {
  beforeEach(() => {
    mockReadFile.mockReset()
  })

  test('empty', () => {
    global.MockGeometry.getAttribute = () => {
      // mock function
    }
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'other',
          solids: [{}],
          faces: [{}]
        })
      return JSON.stringify({})
    })
    require('../run')
    global.document.createElement('canvas')
    try {
      global.document.createElement('node')
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
