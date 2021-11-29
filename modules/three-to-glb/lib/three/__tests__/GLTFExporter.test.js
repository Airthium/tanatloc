const THREE = require('three')
global.threeToGlbGlobal = {
  THREE: THREE
}

const { Blob, FileReader } = require('vblob')

// Fake global
global.threeToGlbGlobal = {}
threeToGlbGlobal.THREE = THREE
threeToGlbGlobal.Blob = Blob
threeToGlbGlobal.FileReader = FileReader

require('../GLTFExporter')

describe('modules/three-to-glb/lib/three/GLTFExporter', () => {
  test('constructor', () => {
    const gltfExporter = new threeToGlbGlobal.THREE.GLTFExporter()
    expect(gltfExporter).toBeDefined()
  })

  test('parse', async () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    geometry.userData = {}
    const material = new THREE.MeshBasicMaterial()
    material.userData = {}
    const cube = new THREE.Mesh(geometry, material)
    cube.userData = {}

    const scene = new THREE.Scene()
    scene.userData = {}
    scene.add(cube)

    const gltfExporter = new threeToGlbGlobal.THREE.GLTFExporter()
    await new Promise((resolve) =>
      gltfExporter.parse(scene, resolve, {
        onlyVisible: false,
        binary: false
      })
    )
  }, 10_000)
})
