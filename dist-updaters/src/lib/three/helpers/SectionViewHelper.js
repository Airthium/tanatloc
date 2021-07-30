"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SectionViewHelper = void 0;

var _three = require("three");

var _TransformControls = require("three/examples/jsm/controls/TransformControls");

/** @module lib/three/helpers/SectionViewHelper */

/**
 * SectionViewHelper
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 * @param {Object} camera Camera
 * @param {Object} controls Controls
 */
var SectionViewHelper = function SectionViewHelper(renderer, scene, camera, controls) {
  // Base color
  var baseColor = new _three.Color('orange'); // Ray caster

  var raycaster = new _three.Raycaster(); // Down

  var isDown = false; // Clipping plane

  var clippingPlane = new _three.Plane(new _three.Vector3(0, 0, 1)); // Transform controls

  var transformControls = new _TransformControls.TransformControls(camera, renderer.domElement);
  transformControls.enabled = false;
  scene.add(transformControls);
  /**
   * Build plane
   */

  var buildPlane = function buildPlane() {
    var geometry = new _three.PlaneGeometry();
    var material = new _three.MeshBasicMaterial({
      color: baseColor,
      side: _three.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    var mesh = new _three.Mesh(geometry, material);
    mesh.clippingPlane = clippingPlane;
    return mesh;
  };

  var controller = buildPlane();
  controller.visible = false;
  controller.type = 'SectionViewHelper';
  scene.add(controller);
  /**
   * Get clipping plane
   */

  var getClippingPlane = function getClippingPlane() {
    return clippingPlane;
  };
  /**
   * Start
   */


  var start = function start() {
    controller.visible = true;
    renderer.localClippingEnabled = true;
    var normal = new _three.Vector3(0, 0, 1); // LookAt

    controller.position.copy(new _three.Vector3(0, 0, 0));
    controller.lookAt(normal); // Set center

    var center = new _three.Vector3();
    scene.boundingBox.getCenter(center);
    controller.position.copy(center); // Set scale

    var size = new _three.Vector3();
    scene.boundingBox.getSize(size);
    var maxSize = Math.max(size.x, size.y, size.z);
    controller.scale.setScalar(maxSize * 1.2); // Clipping plane

    normal.multiplyScalar(-1);
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position);
  };
  /**
   * Stop
   */


  var stop = function stop() {
    controller.visible = false;
    renderer.localClippingEnabled = false;
    transformStop();
  };
  /**
   * Toogle visible
   */


  var toggleVisible = function toggleVisible() {
    var visible = controller.visible;
    controller.visible = !visible;

    if (!controller.visible) {
      transformStop();
    }
  };
  /**
   * To axis
   * @param {Object} normal Normal
   */


  var toAxis = function toAxis(normal) {
    // Set center
    var center = new _three.Vector3();
    scene.boundingBox.getCenter(center);
    controller.position.copy(center); // Clipping plane

    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position); // Look at

    normal.multiplyScalar(-1);
    var lookAt = new _three.Vector3().copy(controller.position).add(normal);
    controller.lookAt(lookAt);
  };
  /**
   * Flip
   */


  var flip = function flip() {
    // Controllers
    controller.rotateX(Math.PI); // Clipping plane

    var normal = clippingPlane.normal.multiplyScalar(-1);
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position);
  };

  var setMode = function setMode(mode) {
    transformControls.setMode(mode);
  };
  /**
   *  Global coordinates to local [-1, 1]^2
   * @param {Object} event Event
   */


  var globalToLocal = function globalToLocal(event) {
    var rect = event.target.getBoundingClientRect();
    var X = event.clientX - rect.left;
    var Y = event.clientY - rect.top;
    var mouse = new _three.Vector2();
    mouse.x = X / rect.width * 2 - 1;
    mouse.y = -(Y / rect.height) * 2 + 1;
    return mouse;
  };
  /**
   * Mouse down
   * @param {Object} event Event
   */


  var onMouseDown = function onMouseDown(event) {
    if (!controller.visible) return;
    isDown = true;
  };
  /**
   * Mouse move
   * @param {Object} event Event
   */


  var onMouseMove = function onMouseMove(event) {
    if (!controller.visible) return;
    if (isDown) return;
    var mouse = globalToLocal(event);
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(controller);

    if (intersects.length > 0) {
      if (!transformControls.enabled) transformStart();
    } else {
      if (transformControls.enabled) transformStop();
    }
  };
  /**
   * Start transform (stop controls)
   */


  var transformStart = function transformStart() {
    controls.enabled = false;
    transformControls.enabled = true;
    transformControls.attach(controller);
  };
  /**
   * Stop transform (start controls)
   */


  var transformStop = function transformStop() {
    controls.enabled = true;
    transformControls.enabled = false;
    transformControls.detach();
  };
  /**
   * Mouse up
   */


  var onMouseUp = function onMouseUp() {
    if (!controller.visible) return;
    isDown = false;
    if (!transformControls.enabled) return;
    var normal = new _three.Vector3(0, 0, 1);
    normal.applyQuaternion(controller.quaternion).multiplyScalar(-1);
    clippingPlane.setFromNormalAndCoplanarPoint(normal, controller.position);
  }; // Event listener


  renderer.domElement.addEventListener('mousedown', onMouseDown);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('mouseup', onMouseUp);
  /**
   * Dispose
   */

  var dispose = function dispose() {
    // Event listener
    renderer.domElement.removeEventListener('mousedown', onMouseDown);
    renderer.domElement.removeEventListener('mousemove', onMouseMove);
    renderer.domElement.removeEventListener('mouseup', onMouseUp); // Meshes

    controller.geometry.dispose();
    controller.material.dispose();
  };

  return {
    getClippingPlane: getClippingPlane,
    start: start,
    toggleVisible: toggleVisible,
    toAxis: toAxis,
    flip: flip,
    setMode: setMode,
    stop: stop,
    dispose: dispose
  };
};

exports.SectionViewHelper = SectionViewHelper;