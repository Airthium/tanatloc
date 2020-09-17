// THREEJS

// Bases classes

class MockGeometry {
  constructor() {
    this.computeBoundingBox = () => {}
    this.computeBoundingSphere = () => {}
    this.lookAt = () => {}
    this.translate = () => {}

    this.boundingSphere = {
      center: new MockVector3(),
      radius: 1
    }
  }
}

class MockMaterial {}

// Child classes

class MockAmbientLight {}

class MockBox2 {
  constructor() {
    this.min = new MockVector2()
    this.max = new MockVector2()
  }
}

class MockBox3 {
  constructor() {
    this.getBoundingSphere = () => new MockSphere()
    this.set = () => {}

    this.min = new MockVector3()
    this.max = new MockVector3()
  }
}

class MockBoxGeometry extends MockGeometry {}

class MockCanvasTexture {}

class MockColor {}

class MockConeGeometry extends MockGeometry {}

class MockCylinderGeometry extends MockGeometry {}

class MockEdgesGeometry extends MockGeometry {}

class MockGroup {
  constructor() {
    this.add = () => {}
    this.lookAt = () => {}
    this.translateZ = () => {}
  }
}

class MockLineBasicMaterial extends MockMaterial {}

class MockLineSegments {}

class MockMesh {
  constructor() {
    this.rotateY = () => {}
    this.geometry = new MockGeometry()
    this.material = new MockMaterial()
  }
}

class MockMeshBasicMaterial extends MockMaterial {}

class MockMeshDepthMaterial extends MockMaterial {}

class MockMeshStandardMaterial extends MockMaterial {}

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

class MockPlaneGeometry extends MockGeometry {}

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

class MockSphereGeometry extends MockGeometry {}

class MockSprite {}

class MockSpriteMaterial extends MockMaterial {}

class MockTetrahedronGeometry extends MockGeometry {}

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
  Box3: MockBox3,
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
