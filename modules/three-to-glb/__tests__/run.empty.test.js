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

jest.mock('three/examples/js/exporters/GLTFExporter', () => {})
jest.mock('three/examples/js/math/Lut', () => {})
jest.mock('three/examples/js/utils/BufferGeometryUtils', () => {})

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
