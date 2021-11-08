const THREE = require('three')
global.threeToGlbGlobal = {
  THREE: THREE
}

require('../Lut')

describe('modules/three-to-glb/lib/three/Lut', () => {
  test('constructor', () => {
    const lut = new threeToGlbGlobal.THREE.Lut()
    expect(lut).toBeDefined()
  })

  test('setMin', () => {
    const lut = new threeToGlbGlobal.THREE.Lut()
    lut.setMin(0)
  })

  test('setMax', () => {
    const lut = new threeToGlbGlobal.THREE.Lut()
    lut.setMax(0)
  })

  test('setColorMap', () => {
    const lut = new threeToGlbGlobal.THREE.Lut()
    lut.setColorMap()
  })

  test('getColor', () => {
    const lut = new threeToGlbGlobal.THREE.Lut()
    lut.setMin(0)
    lut.setMax(1)

    lut.getColor(-0.1)
    lut.getColor(0.5)
    lut.getColor(1)
    lut.getColor(1.1)
  })
})
