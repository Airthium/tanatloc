const THREE = require('three')
global.threeToGlbGlobal = {
  THREE: THREE
}

require('../GLTFExporter')

describe('modules/three-to-glb/lib/three/GLTFExporter', () => {
  test('constructor', () => {
    const lut = new threeToGlbGlobal.THREE.GLTFExporter()
    expect(lut).toBeDefined()
  })
})
