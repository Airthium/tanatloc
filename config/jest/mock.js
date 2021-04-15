// THREEJS

// Bases classes

global.MockGeometry = {
  getAttribute: () => {}
}
class MockBufferGeometry {
  constructor() {
    this.computeBoundingBox = () => {}
    this.computeBoundingSphere = () => {}
    this.dispose = () => {}
    this.getAttribute = (attribute) =>
      global.MockGeometry.getAttribute(attribute)
    this.setAttribute = () => {}
    this.lookAt = () => {}
    this.translate = () => {}
    this.setFromPoints = () => {}

    this.boundingSphere = {
      center: new MockVector3(),
      radius: 1
    }
    this.vertices = {
      push: () => {}
    }
  }
}

class MockMaterial {
  constructor() {
    this.dispose = () => {}
  }
}

class mockFloat32BufferAttribute {}

// Child classes

class MockAmbientLight {}

class MockBox2 {
  constructor() {
    this.min = new MockVector2()
    this.max = new MockVector2()
  }
}

global.MockBox3 = {
  isEmpty: false
}
class MockBox3 {
  constructor() {
    this.getBoundingSphere = () => new MockSphere()
    this.set = () => {}
    this.isEmpty = () => global.MockBox3.isEmpty

    this.min = new MockVector3()
    this.max = new MockVector3()
  }
}

class MockBoxGeometry extends MockBufferGeometry {}

class MockBufferGeometryLoader {
  constructor() {
    this.parse = () => new MockBufferGeometry()
  }
}

class MockCanvasTexture {}

class MockColor {}

class MockConeGeometry extends MockBufferGeometry {}

class MockCylinderGeometry extends MockBufferGeometry {}

class MockEdgesGeometry extends MockBufferGeometry {}

global.MockGroup = {
  children: []
}
class MockGroup {
  constructor() {
    this.add = () => {}
    this.lookAt = () => {}
    this.translateX = () => {}
    this.translateY = () => {}
    this.translateZ = () => {}
    this.rotateX = () => {}
    this.rotateY = () => {}
    this.rotateZ = () => {}

    this.children = global.MockGroup.children
    this.position = new MockVector3()
    this.scale = new MockVector3()
  }
}

class MockLine {}

class MockWireframeGeometry extends MockBufferGeometry {}

class MockLineBasicMaterial extends MockMaterial {}

class MockLineSegments {}

class MockMesh {
  constructor() {
    this.lookAt = () => {}
    this.rotateX = () => {}
    this.rotateY = () => {}
    this.geometry = new MockBufferGeometry()
    this.material = new MockMaterial()
    this.position = new MockVector3()
    this.scale = new MockVector3()
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

class MockPlane {
  constructor() {
    this.setFromNormalAndCoplanarPoint = () => {}
    this.normal = new MockVector3()
  }
}

class MockPlaneGeometry extends MockBufferGeometry {}

class MockPointLight {
  constructor() {
    this.position = new MockVector3()
  }
}

global.MockRaycaster = {
  intersectObjects: [],
  intersectObject: []
}
class MockRaycaster {
  constructor() {
    this.set = () => {}
    this.setFromCamera = () => {}
    this.intersectObjects = () => global.MockRaycaster.intersectObjects
    this.intersectObject = () => global.MockRaycaster.intersectObject
  }
}

global.MockScene = {
  children: []
}
class MockScene {
  constructor() {
    this.add = () => {}
    this.clear = () => {}
    this.remove = () => {}
    this.children = global.MockScene.children
  }
}

class MockSphere {
  constructor() {
    this.center = new MockVector3()
  }
}

class MockSphereGeometry extends MockBufferGeometry {}

class MockSprite extends MockMesh {}

class MockSpriteMaterial extends MockMaterial {}

class MockTetrahedronGeometry extends MockBufferGeometry {}

class MockTexture {
  constructor() {
    this.dispose = () => {}
  }
}

class MockTorusGeometry extends MockBufferGeometry {}

class MockVector2 {
  constructor() {
    this.x = 0
    this.y = 0
  }
}

global.MockVector3 = { x: 0, y: 0, z: 0 }
class MockVector3 {
  constructor() {
    this.x = global.MockVector3.x
    this.y = global.MockVector3.y
    this.z = global.MockVector3.z
    this.applyQuaternion = () => new MockVector3()
    this.unproject = () => new MockVector3()
    this.set = () => new MockVector3()
    this.sub = () => new MockVector3()
    this.multiplyScalar = () => new MockVector3()
    this.normalize = () => new MockVector3()
    this.add = () => new MockVector3()
    this.copy = () => new MockVector3()
    this.setScalar = () => new MockVector3()
  }
}

class MockWebGLRenderer {
  constructor() {
    this.domElement = document.createElement('div')
    this.domElement.toDataURL = jest.fn
    this.setClearColor = () => {}
    this.setSize = () => {}
    this.setPixelRatio = () => {}
    this.setViewport = () => {}
    this.render = () => {}
    this.clear = () => {}
  }
}

export const MockThree = {
  BufferGeometry: MockBufferGeometry,
  Material: MockMaterial,
  Float32BufferAttribute: mockFloat32BufferAttribute,

  AmbientLight: MockAmbientLight,
  Box2: MockBox2,
  Box3: MockBox3,
  BufferGeometryLoader: MockBufferGeometryLoader,
  BoxGeometry: MockBoxGeometry,
  CanvasTexture: MockCanvasTexture,
  Color: MockColor,
  ConeGeometry: MockConeGeometry,
  CylinderGeometry: MockCylinderGeometry,
  EdgesGeometry: MockEdgesGeometry,
  Group: MockGroup,
  Line: MockLine,
  LineBasicMaterial: MockLineBasicMaterial,
  LineSegments: MockLineSegments,
  Mesh: MockMesh,
  MeshBasicMaterial: MockMeshBasicMaterial,
  MeshDepthMaterial: MockMeshDepthMaterial,
  MeshStandardMaterial: MockMeshStandardMaterial,
  OrthographicCamera: MockOrthographicCamera,
  PerspectiveCamera: MockPerspectiveCamera,
  Plane: MockPlane,
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
  TorusGeometry: MockTorusGeometry,
  Vector2: MockVector2,
  Vector3: MockVector3,
  WebGLRenderer: MockWebGLRenderer,
  WireframeGeometry: MockWireframeGeometry
}

jest.mock('three/build/three.module', () => MockThree)
