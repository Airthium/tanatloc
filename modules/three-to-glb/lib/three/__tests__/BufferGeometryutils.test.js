const THREE = require('three')
global.threeToGlbGlobal = {
  THREE: THREE
}

require('../BufferGeometryUtils')

describe('modules/three-to-glb/lib/three/BufferGeometryUtils', () => {
  test('mergeVertices', () => {
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      itemSize: 3
    })
    const geometry = new THREE.BufferGeometry()
    threeToGlbGlobal.THREE.BufferGeometryUtils.mergeVertices(geometry)
  })

  test('mergeVertices, with index', () => {
    global.MockGeometry.getIndex = () => ({
      count: 3,
      getX: () => 1,
      array: [1, 2, 3]
    })
    const geometry = new THREE.BufferGeometry()
    threeToGlbGlobal.THREE.BufferGeometryUtils.mergeVertices(geometry)
  })

  test('mergeVertices, with attributes', () => {
    global.MockGeometry.getAttribute = () => ({
      itemSize: 3,
      array: [1, 2, 3],
      getX: jest.fn(),
      getY: jest.fn(),
      getZ: jest.fn()
    })
    global.MockGeometry.attributes = {
      data: {}
    }
    global.MockGeometry.morphAttributes = {
      data: {
        length: 1,
        0: {
          array: [1, 2, 3],
          getX: jest.fn(),
          getY: jest.fn(),
          getZ: jest.fn()
        }
      }
    }
    const geometry = new THREE.BufferGeometry()
    threeToGlbGlobal.THREE.BufferGeometryUtils.mergeVertices(geometry)
  })
})
