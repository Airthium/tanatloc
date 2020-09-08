// global.console = {
//   debug: jest.fn(),
//   log: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn()
// }

// THREEJS

class MockCanvasTexture {}

class MockColor {}

class MockConeGeometry {
  constructor() {
    this.translate = () => {}
  }
}

class MockCylinderGeometry {
  constructor() {
    this.translate = () => {}
  }
}

class MockEdgesGeometry {}

class MockGroup {
  constructor() {
    this.add = () => {}
    this.lookAt = () => {}
    this.translateZ = () => {}
  }
}

class MockLineBasicMaterial {}

class MockLineSegments {}

class MockMesh {
  constructor() {
    this.rotateY = () => {}
  }
}

class MockMeshBasicMaterial {}

class MockOrthographicCamera {
  constructor() {
    this.rotation = {
      copy: () => {}
    }
    this.position = {}
    this.getWorldDirection = () => {}
  }
}

class MockPlaneGeometry {}

class MockRaycaster {
  constructor() {
    this.set = () => {}
    this.intersectObjects = () => [
      {
        object: {
          parent: {
            children: [
              {},
              {
                material: { color: 'color' }
              }
            ]
          }
        }
      }
    ]
  }
}

class MockScene {
  constructor() {
    this.add = () => {}
  }
}

class MockSphereGeometry {}

class MockSprite {}

class MockSpriteMaterial {}

class MockTexture {}

class MockVector2 {
  constructor() {
    this.x = 0
    this.y = 0
  }
}

class MockVector3 {
  constructor() {
    this.unproject = () => {}
  }
}

jest.mock('three/build/three.module', () => ({
  CanvasTexture: MockCanvasTexture,
  Color: MockColor,
  ConeGeometry: MockConeGeometry,
  CylinderGeometry: MockCylinderGeometry,
  EdgesGeometry: MockEdgesGeometry,
  Group: MockGroup,
  LineBasicMaterial: MockLineBasicMaterial,
  LineSegments: MockLineSegments,
  Mesh: MockMesh,
  MeshBasicMaterial: MockMeshBasicMaterial,
  OrthographicCamera: MockOrthographicCamera,
  PlaneGeometry: MockPlaneGeometry,
  Raycaster: MockRaycaster,
  Scene: MockScene,
  SphereGeometry: MockSphereGeometry,
  Sprite: MockSprite,
  SpriteMaterial: MockSpriteMaterial,
  Texture: MockTexture,
  Vector2: MockVector2,
  Vector3: MockVector3
}))
