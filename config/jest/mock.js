// THREEJS

class MockAmbientLight {}

class MockBox2 {
  constructor() {
    this.min = {}
    this.max = {}
  }
}

class MockBoxGeometry {
  constructor() {
    this.computeBoundingSphere = () => {}
    this.boundingSphere = {
      center: new MockVector3(),
      radius: 1
    }
  }
}

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
    this.geometry = new MockBoxGeometry()
    this.material = new MockMeshBasicMaterial()
  }
}

class MockMeshBasicMaterial {}

class MockMeshDepthMaterial {}

class MockMeshStandardMaterial {}

class MockOrthographicCamera {
  constructor() {
    this.rotation = new MockVector3()
    this.position = new MockVector3()
    this.getWorldDirection = () => {}
  }
}

class MockPerspectiveCamera {
  constructor() {
    this.position = new MockVector3()
    this.updateProjectionMatrix = () => {}
  }
}

class MockPlaneGeometry {}

class MockPointLight {
  constructor() {
    this.position = new MockVector3()
  }
}

global.MockRaycaster = {
  intersectObjects: []
}
class MockRaycaster {
  constructor() {
    this.set = () => {}
    this.setFromCamera = () => {}
    this.intersectObjects = () => global.MockRaycaster.intersectObjects
  }
}

global.MockScene = {
  children: []
}
class MockScene {
  constructor() {
    this.add = () => {}
    this.remove = () => {}
    this.children = global.MockScene.children
  }
}

class MockSphere {
  constructor() {
    this.center = new MockVector3()
  }
}

class MockSphereGeometry {}

class MockSprite {}

class MockSpriteMaterial {}

class MockTetrahedronGeometry {
  constructor() {
    this.translate = () => {}
  }
}

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
    this.set = () => {}
    this.sub = () => new MockVector3()
    this.multiplyScalar = () => {}
    this.normalize = () => new MockVector3()
    this.add = () => new MockVector3()
    this.copy = () => new MockVector3()
  }
}

class MockWebGLRenderer {
  constructor() {
    this.domElement = document.createElement('div')
    this.setClearColor = () => {}
    this.setSize = () => {}
    this.setPixelRatio = () => {}
    this.setViewport = () => {}
    this.render = () => {}
  }
}

const MockThree = {
  AmbientLight: MockAmbientLight,
  Box2: MockBox2,
  BoxGeometry: MockBoxGeometry,
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
  MeshDepthMaterial: MockMeshDepthMaterial,
  MeshStandardMaterial: MockMeshStandardMaterial,
  OrthographicCamera: MockOrthographicCamera,
  PerspectiveCamera: MockPerspectiveCamera,
  PlaneGeometry: MockPlaneGeometry,
  PointLight: MockPointLight,
  Raycaster: MockRaycaster,
  Scene: MockScene,
  Sphere: MockSphere,
  SphereGeometry: MockSphereGeometry,
  Sprite: MockSprite,
  SpriteMaterial: MockSpriteMaterial,
  TetrahedronGeometry: MockTetrahedronGeometry,
  Texture: MockTexture,
  Vector2: MockVector2,
  Vector3: MockVector3,
  WebGLRenderer: MockWebGLRenderer
}

jest.mock('three/build/three.module', () => MockThree)

export default MockThree
