"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectionHelper = void 0;

var _three = require("three");

/** @module lib/three/helpers/SelectionHelper */

/**
 * Selection helper
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 * @param {Object} camera Camera
 * @param {Object} controls Controls
 */
var SelectionHelper = function SelectionHelper(renderer, scene, camera, controls) {
  // Selector element
  var element = document.createElement('div');
  element.style.pointerEvents = 'none';
  element.style.border = '1px solid #55aaff';
  element.style.backgroundColor = 'rgba(75, 160, 255, 0.3)';
  element.style.position = 'fixed'; // Start point

  var startPoint = new _three.Vector2(); // End point

  var endPoint = new _three.Vector2(); // Top-left point

  var pointTopLeft = new _three.Vector2(); // Bottom-right point

  var pointBottomRight = new _three.Vector2(); // Is enabled

  var enabled = false; // Is down

  var down = false; // Raycatser

  var raycaster = new _three.Raycaster();
  /**
   * Start selection
   */

  var start = function start() {
    enabled = true;
  };
  /**
   * End selection
   */


  var end = function end() {
    enabled = false;
  };

  var isEnabled = function isEnabled() {
    return enabled;
  };
  /**
   * Mouse down
   * @param {Object} event Event
   */


  var onMouseDown = function onMouseDown(event) {
    if (!enabled || event.button !== 0) return;
    down = true;
    onSelectStart(event);
  };
  /**
   * Mouse move
   * @param {Object} event Event
   */


  var onMouseMove = function onMouseMove(event) {
    if (!enabled) return;
    if (down) onSelectMove(event);
  };
  /**
   * Mouse up
   * @param {Object} event Event
   */


  var onMouseUp = function onMouseUp(event) {
    down = false;
    if (!enabled) return;
    onSelectEnd(event);
  }; // Event listeners


  renderer.domElement.addEventListener('pointerdown', onMouseDown);
  renderer.domElement.addEventListener('pointermove', onMouseMove);
  renderer.domElement.addEventListener('pointerup', onMouseUp);
  /**
   * Selection start
   * @param {Object} event Event
   */

  var onSelectStart = function onSelectStart(event) {
    controls.enabled = false;
    renderer.domElement.parentElement.appendChild(element);
    element.style.left = event.clientX + 'px';
    element.style.top = event.clientY + 'px';
    element.style.width = '0px';
    element.style.height = '0px';
    startPoint.x = event.clientX;
    startPoint.y = event.clientY;
  };
  /**
   * Selection move
   * @param {Object} event Event
   */


  var onSelectMove = function onSelectMove(event) {
    pointBottomRight.x = Math.max(startPoint.x, event.clientX);
    pointBottomRight.y = Math.max(startPoint.y, event.clientY);
    pointTopLeft.x = Math.min(startPoint.x, event.clientX);
    pointTopLeft.y = Math.min(startPoint.y, event.clientY);
    element.style.left = pointTopLeft.x + 'px';
    element.style.top = pointTopLeft.y + 'px';
    element.style.width = pointBottomRight.x - pointTopLeft.x + 'px';
    element.style.height = pointBottomRight.y - pointTopLeft.y + 'px';
  };
  /**
   * Selection end
   * @param {Object} event Event
   */


  var onSelectEnd = function onSelectEnd(event) {
    controls.enabled = true;
    if (element.parentElement) element.parentElement.removeChild(element);
    endPoint.x = event.clientX;
    endPoint.y = event.clientY;
    var selectionRect = new _three.Box2(startPoint, endPoint);
    zoomToRect(selectionRect);
    end();
  };
  /**
   * Zoom to rectangle
   * @param {Object} rect Rectangle
   */


  var zoomToRect = function zoomToRect(rect) {
    // Center
    var center = new _three.Vector2((rect.max.x + rect.min.x) / 2, (rect.max.y + rect.min.y) / 2);
    var parentRect = renderer.domElement.getBoundingClientRect();
    var X = center.x - parentRect.left;
    var Y = center.y - parentRect.top;
    var raycasterCenter = new _three.Vector2(X / parentRect.width * 2 - 1, -(Y / parentRect.height) * 2 + 1); // Intersection

    raycaster.setFromCamera(raycasterCenter, camera);
    var intersects = raycaster.intersectObjects(scene.children, true); // Set center

    if (intersects.length) {
      controls.target.copy(intersects[0].point);
    } else {
      // Distance
      var tmpDistance = camera.position.distanceTo(controls.target); // Focus point

      var focusPoint = new _three.Vector3();
      focusPoint.set(raycasterCenter.x, raycasterCenter.y, 0);
      focusPoint.unproject(camera);
      focusPoint.sub(camera.position).normalize();
      focusPoint.multiplyScalar(tmpDistance);
      controls.target.copy(camera.position).add(focusPoint);
    } // Zoom


    var size = new _three.Vector2(rect.max.x - rect.min.x, rect.max.y - rect.min.y);
    var ratio = new _three.Vector2(size.x / parentRect.width, size.y / parentRect.height);
    var maxRatio = Math.max(ratio.x, ratio.y);
    var zoomFactor = 1 - maxRatio;
    var distance = camera.position.distanceTo(controls.target);
    var zoomDistance = distance * zoomFactor;
    var translation = controls.target.clone().sub(camera.position).normalize().multiplyScalar(zoomDistance);
    camera.position.add(translation);
  };
  /**
   * Dispose
   */


  var dispose = function dispose() {
    // Event listeners
    renderer.domElement.removeEventListener('pointerdown', onMouseDown);
    renderer.domElement.removeEventListener('pointermove', onMouseMove);
    renderer.domElement.removeEventListener('pointerup', onMouseUp);
  };

  return {
    start: start,
    isEnabled: isEnabled,
    end: end,
    dispose: dispose
  };
};

exports.SelectionHelper = SelectionHelper;