"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridHelper = void 0;

var _three = require("three");

var _LabelHelper = _interopRequireDefault(require("./LabelHelper"));

/** @module lib/three/helpers/GridHelper */

/**
 * GridHelper
 * @param {Object} scene Scene
 */
var GridHelper = function GridHelper(scene) {
  // Grid color
  var gridColor = '#888888'; // Min divisions

  var minDivisions = 3; // Max divisions

  var maxDivisions = 6; // Grid overflow (% of maxsize)

  var overflowGrid = 0; // Grid separation (% of maxsize)

  var overspaceGrid = 0.15; // Variable

  var maxSize;
  var gridHelper;
  /**
   * Get number of division for each axis
   * @param {Object} size Size
   */

  var getDivisions = function getDivisions(size) {
    var xDiv = Math.max(Math.ceil(size.x / maxSize * maxDivisions), minDivisions);
    var yDiv = Math.max(Math.ceil(size.y / maxSize * maxDivisions), minDivisions);
    var zDiv = Math.max(Math.ceil(size.z / maxSize * maxDivisions), minDivisions);
    return new _three.Vector3(xDiv, yDiv, zDiv);
  };
  /**
   * Create grid
   * @param {Object} dimensions Dimensions
   */


  var createGrid = function createGrid(_ref) {
    var offsetWidth = _ref.offsetWidth,
        width = _ref.width,
        height = _ref.height,
        wDiv = _ref.wDiv,
        hDiv = _ref.hDiv,
        rotate = _ref.rotate,
        translation = _ref.translation;
    var grid = new _three.Group();
    var material = new _three.LineBasicMaterial({
      color: gridColor
    });
    var origin = new _three.Vector2(-width / 2, -height / 2);
    var xStep = width / (wDiv - 1);
    var yStep = height / (hDiv - 1);

    for (var i = 0; i < hDiv; ++i) {
      var lineGeometry = new _three.BufferGeometry().setFromPoints([new _three.Vector3(origin.x, origin.y + i * yStep, 0), new _three.Vector3(origin.x + width, origin.y + i * yStep)]);
      var line = new _three.Line(lineGeometry, material);
      var size = 512;
      var fontSize = 64;
      var scale = maxSize / 5;
      var label1 = (0, _LabelHelper["default"])(Math.abs(offsetWidth) > 1e-12 ? Math.abs(offsetWidth) > 1000 || Math.abs(offsetWidth) < 0.001 ? offsetWidth.toExponential(2) : offsetWidth.toFixed(3) : 0, size, 'grey', fontSize);
      label1.translateX(-width / 2);
      label1.translateY(height / 2 + overflowGrid * maxSize);
      label1.scale.setScalar(scale);
      var label2 = (0, _LabelHelper["default"])(Math.abs(width) > 1e-12 ? Math.abs(width) > 1000 || Math.abs(width) < 0.001 ? width.toExponential(2) : width.toFixed(3) : 0, size, 'grey', fontSize);
      label2.translateX(width / 2);
      label2.translateY(height / 2 + overflowGrid * maxSize);
      label2.scale.setScalar(scale);
      grid.add(line);
      grid.add(label1);
      grid.add(label2);
    }

    for (var _i = 0; _i < wDiv; ++_i) {
      var _lineGeometry = new _three.BufferGeometry().setFromPoints([new _three.Vector3(origin.x + _i * xStep, origin.y, 0), new _three.Vector3(origin.x + _i * xStep, origin.y + height)]);

      var _line = new _three.Line(_lineGeometry, material);

      grid.add(_line);
    }

    grid.translateX(translation.x);
    grid.translateY(translation.y);
    grid.translateZ(translation.z);
    grid.rotateX(rotate.x);
    grid.rotateY(rotate.y);
    grid.rotateZ(rotate.z);
    return grid;
  };
  /**
   * Build grid
   */


  var build = function build() {
    var boundingBox = scene.boundingBox;
    var center = scene.boundingSphere.center;
    var size = new _three.Vector3(boundingBox.max.x - boundingBox.min.x, boundingBox.max.y - boundingBox.min.y, boundingBox.max.z - boundingBox.min.z);
    maxSize = Math.max(size.x, size.y, size.z);
    var divisions = getDivisions(size);
    var grid = new _three.Group();
    var gridXY = createGrid({
      offsetWidth: boundingBox.min.x,
      width: size.x + maxSize * overflowGrid,
      height: size.y + maxSize * overflowGrid,
      wDiv: divisions.x,
      hDiv: divisions.y,
      rotate: new _three.Vector3(0, 0, 0),
      translation: new _three.Vector3(center.x, center.y, center.z - (size.z + overspaceGrid * maxSize) / 2)
    });
    var gridZX = createGrid({
      offsetWidth: boundingBox.min.z,
      width: size.z + maxSize * overflowGrid,
      height: size.x + maxSize * overflowGrid,
      wDiv: divisions.z,
      hDiv: divisions.x,
      rotate: new _three.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      translation: new _three.Vector3(center.x, center.y - (size.y + overspaceGrid * maxSize) / 2, center.z)
    });
    var gridYZ = createGrid({
      offsetWidth: boundingBox.min.y,
      width: size.y + maxSize * overflowGrid,
      height: size.z + maxSize * overflowGrid,
      wDiv: divisions.y,
      hDiv: divisions.z,
      rotate: new _three.Vector3(Math.PI / 2, Math.PI / 2, 0),
      translation: new _three.Vector3(center.x - (size.x + overspaceGrid * maxSize) / 2, center.y, center.z)
    });
    grid.add(gridXY);
    grid.add(gridZX);
    grid.add(gridYZ);
    grid.type = 'GridHelper';
    grid.dispose = dispose;
    return grid;
  };
  /**
   * Update
   */


  var update = function update() {
    scene.children.forEach(function (child) {
      if (child.type === 'GridHelper') {
        scene.remove(child);
        child.dispose();
      }
    });
    gridHelper = build();
    scene.add(gridHelper);
  };
  /**
   * Set visible
   * @param {boolean} visible Visible
   */


  var setVisible = function setVisible(visible) {
    gridHelper.visible = visible;
  };
  /**
   * Dispose
   */


  var dispose = function dispose() {
    gridHelper && gridHelper.children.forEach(function (group) {
      group.children.forEach(function (child) {
        child.geometry.dispose();
        child.material.dispose();
      });
    });
  };

  return {
    update: update,
    setVisible: setVisible,
    dispose: dispose
  };
};

exports.GridHelper = GridHelper;