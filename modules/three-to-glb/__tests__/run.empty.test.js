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
    mockReadFile.mockImplementation(() => JSON.stringify({}))
    require('../run')
  })
})
