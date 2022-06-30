// THREEJS

// Bases classes

const traverse = (child, callback) => {
  callback(child)

  const children = child.children || []
  for (const subChild of children) {
    traverse(subChild, callback)
  }
}

global.MockObject3D = {
  children: []
}
class MockObject3D {
  constructor() {
    this.add = jest.fn()
    this.lookAt = jest.fn()
    this.position = new MockVector3()
    this.translateX = jest.fn()
    this.translateY = jest.fn()
    this.translateZ = jest.fn()
    this.traverse = (callback) => {
      global.MockObject3D.children.forEach((child) => {
        traverse(child, callback)
      })
    }
    this.rotateX = jest.fn()
    this.rotateY = jest.fn()
    this.rotateZ = jest.fn()
    this.rotateOnWorldAxis = jest.fn()

    this.children = global.MockObject3D.children
    this.position = new MockVector3()
    this.rotation = new MockEuler()
    this.scale = new MockVector3()
  }
}

global.MockGeometry = {
  attributes: {},
  morphAttributes: {},
  getAttribute: jest.fn(),
  getIndex: jest.fn()
}
class MockBufferGeometry {
  constructor() {
    this.clone = () => this
    this.computeBoundingBox = () => jest.fn()
    this.computeBoundingSphere = () => jest.fn()
    this.deleteAttribute = () => jest.fn()
    this.dispose = () => jest.fn()
    this.getAttribute = (attribute) =>
      global.MockGeometry.getAttribute(attribute)
    this.setAttribute = () => jest.fn()
    this.getIndex = () => global.MockGeometry.getIndex()
    this.setIndex = () => jest.fn()
    this.lookAt = () => jest.fn()
    this.translate = () => jest.fn()
    this.setFromPoints = () => jest.fn()

    this.attributes = global.MockGeometry.attributes
    this.morphAttributes = global.MockGeometry.morphAttributes
    this.boundingSphere = {
      center: new MockVector3(),
      radius: 1
    }
    this.vertices = {
      push: () => jest.fn()
    }
  }
}

class MockBufferAttribute {}

class MockMaterial {
  constructor() {
    this.map = {
      anisotropy: 1
    }
    this.dispose = jest.fn()
  }
}

class MockFloat32BufferAttribute {}

// Child classes

class MockAmbientLight {}

global.MockBox2 = {
  getSize: (vector) => {
    vector.x = 0
    vector.y = 0
  }
}
class MockBox2 {
  constructor() {
    this.min = new MockVector2()
    this.max = new MockVector2()
    this.getSize = global.MockBox2.getSize
  }
}

global.MockBox3 = {
  isEmpty: false
}
class MockBox3 {
  constructor() {
    this.getBoundingSphere = () => new MockSphere()
    this.set = jest.fn()
    this.isEmpty = () => global.MockBox3.isEmpty
    this.getCenter = jest.fn()
    this.getSize = jest.fn()
    this.expandByObject = jest.fn()

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

class MockColor {
  constructor() {
    this.lerp = jest.fn()
  }
}

class MockConeGeometry extends MockBufferGeometry {}

class MockCurve {
  constructor() {
    this.getPoint(0)
  }
}

class MockCylinderGeometry extends MockBufferGeometry {}

class MockEdgesGeometry extends MockBufferGeometry {}

global.MockGroup = {
  children: []
}
class MockGroup {
  constructor() {
    this.add = jest.fn()
    this.lookAt = jest.fn()
    this.position = new MockVector3()
    this.translateX = jest.fn()
    this.translateY = jest.fn()
    this.translateZ = jest.fn()
    this.remove = jest.fn()
    this.traverse = (callback) => {
      global.MockGroup.children.forEach((child) => {
        traverse(child, callback)
      })
    }
    this.rotateX = jest.fn()
    this.rotateY = jest.fn()
    this.rotateZ = jest.fn()
    this.rotateOnWorldAxis = jest.fn()

    this.children = global.MockGroup.children
    this.position = new MockVector3()
    this.rotation = new MockEuler()
    this.scale = new MockVector3()
  }
}

class MockLine {}

class MockLine3 {
  constructor() {
    this.set = jest.fn()
    this.closestPointToPoint = jest.fn()
  }
}

class MockWireframeGeometry extends MockBufferGeometry {}

class MockLineBasicMaterial extends MockMaterial {}

class MockMesh {
  constructor() {
    this.add = jest.fn()
    this.lookAt = jest.fn()
    this.rotateX = jest.fn()
    this.rotateY = jest.fn()
    this.geometry = new MockBufferGeometry()
    this.material = new MockMaterial()
    this.position = new MockVector3()
    this.scale = new MockVector3()
    this.userData = {}
  }
}

class MockLineSegments extends MockMesh {}

class MockMeshBasicMaterial extends MockMaterial {}

class MockMeshDepthMaterial extends MockMaterial {}

class MockMeshStandardMaterial extends MockMaterial {}

class MockOrthographicCamera {
  constructor() {
    this.rotation = new MockVector3()
    this.position = new MockVector3()
    this.getWorldDirection = jest.fn()
  }
}

class MockPerspectiveCamera {
  constructor() {
    this.add = jest.fn
    this.up = new MockVector3()
    this.position = new MockVector3()
    this.updateProjectionMatrix = jest.fn()
  }
}

class MockPlane {
  constructor() {
    this.setFromNormalAndCoplanarPoint = jest.fn()
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
  intersectObject: [],
  intersectPlane: []
}
class MockRaycaster {
  constructor() {
    this.set = jest.fn()
    this.setFromCamera = jest.fn()
    this.ray = {
      intersectPlane: () => global.MockRaycaster.intersectPlane
    }
    this.intersectObjects = () => global.MockRaycaster.intersectObjects
    this.intersectObject = () => global.MockRaycaster.intersectObject
  }
}

global.MockScene = {
  children: []
}
class MockScene {
  constructor() {
    this.add = jest.fn()
    this.clear = jest.fn()
    this.remove = jest.fn()
    this.children = global.MockScene.children
    this.boundingSphere = {}
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

class MockTubeGeometry extends MockBufferGeometry {}

class MockTexture {
  constructor() {
    this.dispose = jest.fn()
  }
}

class MockTorusGeometry extends MockBufferGeometry {}

class MockVector2 {
  constructor() {
    this.x = 0
    this.y = 0
    this.copy = jest.fn()
  }
}

global.MockVector3 = { x: 0, y: 0, z: 0, equals: jest.fn() }
class MockVector3 {
  constructor() {
    this.x = global.MockVector3.x
    this.y = global.MockVector3.y
    this.z = global.MockVector3.z
    this.distanceTo = jest.fn()
    this.equals = global.MockVector3.equals
    this.clone = () => new MockVector3()
    this.applyQuaternion = () => new MockVector3()
    this.unproject = () => new MockVector3()
    this.set = () => new MockVector3()
    this.sub = () => new MockVector3()
    this.multiplyScalar = () => new MockVector3()
    this.normalize = () => new MockVector3()
    this.add = () => new MockVector3()
    this.copy = () => new MockVector3()
    this.setScalar = () => new MockVector3()
    this.cross = () => new MockVector3()
    this.crossVectors = () => new MockVector3()
    this.dot = () => new MockVector3()
  }
}

global.MockWebGLRenderer = {
  toDataURL: jest.fn
}
class MockWebGLRenderer {
  constructor() {
    this.domElement = document.createElement('div')
    this.shadowMap = {
      enabled: false
    }
    this.domElement.toDataURL = global.MockWebGLRenderer.toDataURL
    this.setClearColor = jest.fn()
    this.setSize = jest.fn()
    this.setPixelRatio = jest.fn()
    this.setViewport = jest.fn()
    this.render = jest.fn()
    this.clear = jest.fn()
  }
}

class MockGLTFExporter {
  constructor() {
    this.parse = (_, finish) => {
      finish('gltf')
    }
  }
}

class MockLut {
  constructor() {
    this.setMin = jest.fn()
    this.setMax = jest.fn()
    this.getColor = () => ({ r: 0, g: 0.5, b: 1 })
  }
}

class MockEuler {
  constructor() {
    this.copy = jest.fn()
  }
}

const MockBufferGeometryUtils = {
  mergeVertices: jest.fn()
}

export const MockThree = {
  Object3D: MockObject3D,
  BufferGeometry: MockBufferGeometry,
  BufferAttribute: MockBufferAttribute,
  Material: MockMaterial,
  Float32BufferAttribute: MockFloat32BufferAttribute,

  AmbientLight: MockAmbientLight,
  Box2: MockBox2,
  Box3: MockBox3,
  BufferGeometryLoader: MockBufferGeometryLoader,
  BoxGeometry: MockBoxGeometry,
  CanvasTexture: MockCanvasTexture,
  Color: MockColor,
  ConeGeometry: MockConeGeometry,
  Curve: MockCurve,
  CylinderGeometry: MockCylinderGeometry,
  EdgesGeometry: MockEdgesGeometry,
  Euler: MockEuler,
  Group: MockGroup,
  Line: MockLine,
  Line3: MockLine3,
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
  TubeGeometry: MockTubeGeometry,
  Vector2: MockVector2,
  Vector3: MockVector3,
  WebGLRenderer: MockWebGLRenderer,
  WireframeGeometry: MockWireframeGeometry,

  GLTFExporter: MockGLTFExporter,
  Lut: MockLut,
  BufferGeometryUtils: MockBufferGeometryUtils
}

jest.mock('three', () => MockThree)
