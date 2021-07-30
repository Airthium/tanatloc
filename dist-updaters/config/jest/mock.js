"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MockThree = void 0;

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// THREEJS
// Bases classes
global.MockGeometry = {
  getAttribute: jest.fn()
};

var MockBufferGeometry = function MockBufferGeometry() {
  (0, _classCallCheck2["default"])(this, MockBufferGeometry);

  this.computeBoundingBox = function () {
    return jest.fn();
  };

  this.computeBoundingSphere = function () {
    return jest.fn();
  };

  this.deleteAttribute = function () {
    return jest.fn();
  };

  this.dispose = function () {
    return jest.fn();
  };

  this.getAttribute = function (attribute) {
    return global.MockGeometry.getAttribute(attribute);
  };

  this.setAttribute = function () {
    return jest.fn();
  };

  this.lookAt = function () {
    return jest.fn();
  };

  this.translate = function () {
    return jest.fn();
  };

  this.setFromPoints = function () {
    return jest.fn();
  };

  this.attributes = {};
  this.boundingSphere = {
    center: new MockVector3(),
    radius: 1
  };
  this.vertices = {
    push: function push() {
      return jest.fn();
    }
  };
};

var MockMaterial = function MockMaterial() {
  (0, _classCallCheck2["default"])(this, MockMaterial);
  this.dispose = jest.fn();
};

var MockFloat32BufferAttribute = function MockFloat32BufferAttribute() {
  (0, _classCallCheck2["default"])(this, MockFloat32BufferAttribute);
}; // Child classes


var MockAmbientLight = function MockAmbientLight() {
  (0, _classCallCheck2["default"])(this, MockAmbientLight);
};

var MockBox2 = function MockBox2() {
  (0, _classCallCheck2["default"])(this, MockBox2);
  this.min = new MockVector2();
  this.max = new MockVector2();
};

global.MockBox3 = {
  isEmpty: false
};

var MockBox3 = function MockBox3() {
  (0, _classCallCheck2["default"])(this, MockBox3);

  this.getBoundingSphere = function () {
    return new MockSphere();
  };

  this.set = jest.fn();

  this.isEmpty = function () {
    return global.MockBox3.isEmpty;
  };

  this.min = new MockVector3();
  this.max = new MockVector3();
};

var MockBoxGeometry = /*#__PURE__*/function (_MockBufferGeometry) {
  (0, _inherits2["default"])(MockBoxGeometry, _MockBufferGeometry);

  var _super = _createSuper(MockBoxGeometry);

  function MockBoxGeometry() {
    (0, _classCallCheck2["default"])(this, MockBoxGeometry);
    return _super.apply(this, arguments);
  }

  return MockBoxGeometry;
}(MockBufferGeometry);

var MockBufferGeometryLoader = function MockBufferGeometryLoader() {
  (0, _classCallCheck2["default"])(this, MockBufferGeometryLoader);

  this.parse = function () {
    return new MockBufferGeometry();
  };
};

var MockCanvasTexture = function MockCanvasTexture() {
  (0, _classCallCheck2["default"])(this, MockCanvasTexture);
};

var MockColor = function MockColor() {
  (0, _classCallCheck2["default"])(this, MockColor);
};

var MockConeGeometry = /*#__PURE__*/function (_MockBufferGeometry2) {
  (0, _inherits2["default"])(MockConeGeometry, _MockBufferGeometry2);

  var _super2 = _createSuper(MockConeGeometry);

  function MockConeGeometry() {
    (0, _classCallCheck2["default"])(this, MockConeGeometry);
    return _super2.apply(this, arguments);
  }

  return MockConeGeometry;
}(MockBufferGeometry);

var MockCylinderGeometry = /*#__PURE__*/function (_MockBufferGeometry3) {
  (0, _inherits2["default"])(MockCylinderGeometry, _MockBufferGeometry3);

  var _super3 = _createSuper(MockCylinderGeometry);

  function MockCylinderGeometry() {
    (0, _classCallCheck2["default"])(this, MockCylinderGeometry);
    return _super3.apply(this, arguments);
  }

  return MockCylinderGeometry;
}(MockBufferGeometry);

var MockEdgesGeometry = /*#__PURE__*/function (_MockBufferGeometry4) {
  (0, _inherits2["default"])(MockEdgesGeometry, _MockBufferGeometry4);

  var _super4 = _createSuper(MockEdgesGeometry);

  function MockEdgesGeometry() {
    (0, _classCallCheck2["default"])(this, MockEdgesGeometry);
    return _super4.apply(this, arguments);
  }

  return MockEdgesGeometry;
}(MockBufferGeometry);

global.MockGroup = {
  children: []
};

var MockGroup = function MockGroup() {
  (0, _classCallCheck2["default"])(this, MockGroup);
  this.add = jest.fn();
  this.lookAt = jest.fn();
  this.translateX = jest.fn();
  this.translateY = jest.fn();
  this.translateZ = jest.fn();
  this.rotateX = jest.fn();
  this.rotateY = jest.fn();
  this.rotateZ = jest.fn();
  this.children = global.MockGroup.children;
  this.position = new MockVector3();
  this.scale = new MockVector3();
};

var MockLine = function MockLine() {
  (0, _classCallCheck2["default"])(this, MockLine);
};

var MockWireframeGeometry = /*#__PURE__*/function (_MockBufferGeometry5) {
  (0, _inherits2["default"])(MockWireframeGeometry, _MockBufferGeometry5);

  var _super5 = _createSuper(MockWireframeGeometry);

  function MockWireframeGeometry() {
    (0, _classCallCheck2["default"])(this, MockWireframeGeometry);
    return _super5.apply(this, arguments);
  }

  return MockWireframeGeometry;
}(MockBufferGeometry);

var MockLineBasicMaterial = /*#__PURE__*/function (_MockMaterial) {
  (0, _inherits2["default"])(MockLineBasicMaterial, _MockMaterial);

  var _super6 = _createSuper(MockLineBasicMaterial);

  function MockLineBasicMaterial() {
    (0, _classCallCheck2["default"])(this, MockLineBasicMaterial);
    return _super6.apply(this, arguments);
  }

  return MockLineBasicMaterial;
}(MockMaterial);

var MockMesh = function MockMesh() {
  (0, _classCallCheck2["default"])(this, MockMesh);
  this.add = jest.fn();
  this.lookAt = jest.fn();
  this.rotateX = jest.fn();
  this.rotateY = jest.fn();
  this.geometry = new MockBufferGeometry();
  this.material = new MockMaterial();
  this.position = new MockVector3();
  this.scale = new MockVector3();
  this.userData = {};
};

var MockLineSegments = /*#__PURE__*/function (_MockMesh) {
  (0, _inherits2["default"])(MockLineSegments, _MockMesh);

  var _super7 = _createSuper(MockLineSegments);

  function MockLineSegments() {
    (0, _classCallCheck2["default"])(this, MockLineSegments);
    return _super7.apply(this, arguments);
  }

  return MockLineSegments;
}(MockMesh);

var MockMeshBasicMaterial = /*#__PURE__*/function (_MockMaterial2) {
  (0, _inherits2["default"])(MockMeshBasicMaterial, _MockMaterial2);

  var _super8 = _createSuper(MockMeshBasicMaterial);

  function MockMeshBasicMaterial() {
    (0, _classCallCheck2["default"])(this, MockMeshBasicMaterial);
    return _super8.apply(this, arguments);
  }

  return MockMeshBasicMaterial;
}(MockMaterial);

var MockMeshDepthMaterial = /*#__PURE__*/function (_MockMaterial3) {
  (0, _inherits2["default"])(MockMeshDepthMaterial, _MockMaterial3);

  var _super9 = _createSuper(MockMeshDepthMaterial);

  function MockMeshDepthMaterial() {
    (0, _classCallCheck2["default"])(this, MockMeshDepthMaterial);
    return _super9.apply(this, arguments);
  }

  return MockMeshDepthMaterial;
}(MockMaterial);

var MockMeshStandardMaterial = /*#__PURE__*/function (_MockMaterial4) {
  (0, _inherits2["default"])(MockMeshStandardMaterial, _MockMaterial4);

  var _super10 = _createSuper(MockMeshStandardMaterial);

  function MockMeshStandardMaterial() {
    (0, _classCallCheck2["default"])(this, MockMeshStandardMaterial);
    return _super10.apply(this, arguments);
  }

  return MockMeshStandardMaterial;
}(MockMaterial);

var MockOrthographicCamera = function MockOrthographicCamera() {
  (0, _classCallCheck2["default"])(this, MockOrthographicCamera);
  this.rotation = new MockVector3();
  this.position = new MockVector3();
  this.getWorldDirection = jest.fn();
};

var MockPerspectiveCamera = function MockPerspectiveCamera() {
  (0, _classCallCheck2["default"])(this, MockPerspectiveCamera);
  this.position = new MockVector3();
  this.updateProjectionMatrix = jest.fn();
};

var MockPlane = function MockPlane() {
  (0, _classCallCheck2["default"])(this, MockPlane);
  this.setFromNormalAndCoplanarPoint = jest.fn();
  this.normal = new MockVector3();
};

var MockPlaneGeometry = /*#__PURE__*/function (_MockBufferGeometry6) {
  (0, _inherits2["default"])(MockPlaneGeometry, _MockBufferGeometry6);

  var _super11 = _createSuper(MockPlaneGeometry);

  function MockPlaneGeometry() {
    (0, _classCallCheck2["default"])(this, MockPlaneGeometry);
    return _super11.apply(this, arguments);
  }

  return MockPlaneGeometry;
}(MockBufferGeometry);

var MockPointLight = function MockPointLight() {
  (0, _classCallCheck2["default"])(this, MockPointLight);
  this.position = new MockVector3();
};

global.MockRaycaster = {
  intersectObjects: [],
  intersectObject: []
};

var MockRaycaster = function MockRaycaster() {
  (0, _classCallCheck2["default"])(this, MockRaycaster);
  this.set = jest.fn();
  this.setFromCamera = jest.fn();

  this.intersectObjects = function () {
    return global.MockRaycaster.intersectObjects;
  };

  this.intersectObject = function () {
    return global.MockRaycaster.intersectObject;
  };
};

global.MockScene = {
  children: []
};

var MockScene = function MockScene() {
  (0, _classCallCheck2["default"])(this, MockScene);
  this.add = jest.fn();
  this.clear = jest.fn();
  this.remove = jest.fn();
  this.children = global.MockScene.children;
};

var MockSphere = function MockSphere() {
  (0, _classCallCheck2["default"])(this, MockSphere);
  this.center = new MockVector3();
};

var MockSphereGeometry = /*#__PURE__*/function (_MockBufferGeometry7) {
  (0, _inherits2["default"])(MockSphereGeometry, _MockBufferGeometry7);

  var _super12 = _createSuper(MockSphereGeometry);

  function MockSphereGeometry() {
    (0, _classCallCheck2["default"])(this, MockSphereGeometry);
    return _super12.apply(this, arguments);
  }

  return MockSphereGeometry;
}(MockBufferGeometry);

var MockSprite = /*#__PURE__*/function (_MockMesh2) {
  (0, _inherits2["default"])(MockSprite, _MockMesh2);

  var _super13 = _createSuper(MockSprite);

  function MockSprite() {
    (0, _classCallCheck2["default"])(this, MockSprite);
    return _super13.apply(this, arguments);
  }

  return MockSprite;
}(MockMesh);

var MockSpriteMaterial = /*#__PURE__*/function (_MockMaterial5) {
  (0, _inherits2["default"])(MockSpriteMaterial, _MockMaterial5);

  var _super14 = _createSuper(MockSpriteMaterial);

  function MockSpriteMaterial() {
    (0, _classCallCheck2["default"])(this, MockSpriteMaterial);
    return _super14.apply(this, arguments);
  }

  return MockSpriteMaterial;
}(MockMaterial);

var MockTetrahedronGeometry = /*#__PURE__*/function (_MockBufferGeometry8) {
  (0, _inherits2["default"])(MockTetrahedronGeometry, _MockBufferGeometry8);

  var _super15 = _createSuper(MockTetrahedronGeometry);

  function MockTetrahedronGeometry() {
    (0, _classCallCheck2["default"])(this, MockTetrahedronGeometry);
    return _super15.apply(this, arguments);
  }

  return MockTetrahedronGeometry;
}(MockBufferGeometry);

var MockTexture = function MockTexture() {
  (0, _classCallCheck2["default"])(this, MockTexture);
  this.dispose = jest.fn();
};

var MockTorusGeometry = /*#__PURE__*/function (_MockBufferGeometry9) {
  (0, _inherits2["default"])(MockTorusGeometry, _MockBufferGeometry9);

  var _super16 = _createSuper(MockTorusGeometry);

  function MockTorusGeometry() {
    (0, _classCallCheck2["default"])(this, MockTorusGeometry);
    return _super16.apply(this, arguments);
  }

  return MockTorusGeometry;
}(MockBufferGeometry);

var MockVector2 = function MockVector2() {
  (0, _classCallCheck2["default"])(this, MockVector2);
  this.x = 0;
  this.y = 0;
};

global.MockVector3 = {
  x: 0,
  y: 0,
  z: 0
};

var MockVector3 = function MockVector3() {
  (0, _classCallCheck2["default"])(this, MockVector3);
  this.x = global.MockVector3.x;
  this.y = global.MockVector3.y;
  this.z = global.MockVector3.z;

  this.applyQuaternion = function () {
    return new MockVector3();
  };

  this.unproject = function () {
    return new MockVector3();
  };

  this.set = function () {
    return new MockVector3();
  };

  this.sub = function () {
    return new MockVector3();
  };

  this.multiplyScalar = function () {
    return new MockVector3();
  };

  this.normalize = function () {
    return new MockVector3();
  };

  this.add = function () {
    return new MockVector3();
  };

  this.copy = function () {
    return new MockVector3();
  };

  this.setScalar = function () {
    return new MockVector3();
  };
};

var MockWebGLRenderer = function MockWebGLRenderer() {
  (0, _classCallCheck2["default"])(this, MockWebGLRenderer);
  this.domElement = document.createElement('div');
  this.domElement.toDataURL = jest.fn;
  this.setClearColor = jest.fn();
  this.setSize = jest.fn();
  this.setPixelRatio = jest.fn();
  this.setViewport = jest.fn();
  this.render = jest.fn();
  this.clear = jest.fn();
};

var MockGLTFExporter = function MockGLTFExporter() {
  (0, _classCallCheck2["default"])(this, MockGLTFExporter);

  this.parse = function (_, finish) {
    finish('gltf');
  };
};

var MockLut = function MockLut() {
  (0, _classCallCheck2["default"])(this, MockLut);
  this.setMin = jest.fn();
  this.setMax = jest.fn();

  this.getColor = function () {
    return {
      r: 0,
      g: 0.5,
      b: 1
    };
  };
};

var MockBufferGeometryUtils = {
  mergeVertices: jest.fn()
};
var MockThree = {
  BufferGeometry: MockBufferGeometry,
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
  WireframeGeometry: MockWireframeGeometry,
  GLTFExporter: MockGLTFExporter,
  Lut: MockLut,
  BufferGeometryUtils: MockBufferGeometryUtils
};
exports.MockThree = MockThree;
jest.mock('three', function () {
  return MockThree;
});