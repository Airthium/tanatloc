"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AxisHelper = void 0;

var _three = require("three");

var _ArrowHelper = _interopRequireDefault(require("./ArrowHelper"));

var _LabelHelper = _interopRequireDefault(require("./LabelHelper"));

/** @module lib/three/helpers/AxisHelper */
// Default width in viewport
var defaultWidth = 150; // Default height in viewport

var defaultHeight = 150;
/**
 * Axis helper
 * @param {Object} renderer Renderer
 * @param {Object} camera Camera
 * @param {Object} dimensions Dimensions
 */

var AxisHelper = function AxisHelper(renderer, camera) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    offsetWidth: 0,
    offsetHeight: 0,
    width: defaultWidth,
    height: defaultHeight
  },
      offsetWidth = _ref.offsetWidth,
      offsetHeight = _ref.offsetHeight,
      width = _ref.width,
      height = _ref.height;

  // X-axis color
  var xColor = 'red'; // Y-axis color

  var yColor = 'green'; // Z-axis color

  var zColor = 'blue'; // Base sphere color

  var baseColor = 'black'; // Size

  var currentOffsetWidth = offsetWidth;
  var currentOffsetHeight = offsetHeight;
  var currentWidth = width;
  var currentHeight = height; // X

  var x = (0, _ArrowHelper["default"])(xColor);
  x.rotateZ(-Math.PI / 2);
  var xLabel = (0, _LabelHelper["default"])('X');
  xLabel.scale.setScalar(0.2);
  xLabel.position.set(1.1, 0, 0); // Y

  var y = (0, _ArrowHelper["default"])(yColor);
  var yLabel = (0, _LabelHelper["default"])('Y');
  yLabel.scale.setScalar(0.2);
  yLabel.position.set(0, 1.1, 0); // Z

  var z = (0, _ArrowHelper["default"])(zColor);
  z.rotateX(Math.PI / 2);
  var zLabel = (0, _LabelHelper["default"])('Z');
  zLabel.scale.setScalar(0.2);
  zLabel.position.set(0, 0, 1.1); // Sphere

  var sphereGeometry = new _three.SphereGeometry(0.05, 50, 50);
  var sphereMaterial = new _three.MeshBasicMaterial({
    color: baseColor
  });
  var sphere = new _three.Mesh(sphereGeometry, sphereMaterial); // Axis helper

  var mesh = new _three.Group();
  mesh.type = 'AxisHelper';
  mesh.add(x);
  mesh.add(xLabel);
  mesh.add(y);
  mesh.add(yLabel);
  mesh.add(z);
  mesh.add(zLabel);
  mesh.add(sphere); // Scene

  var localScene = new _three.Scene();
  localScene.add(mesh); // Camera

  var localCamera = new _three.OrthographicCamera(-1.2, 1.2, 1.2, -1.2, -2, 2);
  /**
   * Resize
   * @param {Object} dimensions Dimensions
   */

  var resize = function resize(_ref2) {
    var newOffsetWidth = _ref2.newOffsetWidth,
        newOffsetHeight = _ref2.newOffsetHeight,
        newWidth = _ref2.newWidth,
        newHeight = _ref2.newHeight;
    currentOffsetWidth = newOffsetWidth;
    currentOffsetHeight = newOffsetHeight;
    currentWidth = newWidth;
    currentHeight = newHeight;
  };
  /**
   * Render
   */


  var render = function render() {
    renderer.setViewport(currentOffsetWidth, currentOffsetHeight, currentWidth, currentHeight);
    localCamera.rotation.copy(camera.rotation);
    renderer.render(localScene, localCamera);
  };
  /**
   * Dispose
   */


  var dispose = function dispose() {
    sphereGeometry.dispose();
    sphereMaterial.dispose();
    mesh.children.forEach(function (child) {
      if (child.type === 'ArrowHelper' || child.type === 'LabelHelper') child.dispose();
    });
    localScene.remove(mesh);
  };

  return {
    resize: resize,
    render: render,
    dispose: dispose
  };
};

exports.AxisHelper = AxisHelper;