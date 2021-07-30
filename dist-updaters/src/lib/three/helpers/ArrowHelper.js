"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _three = require("three");

/** @module lib/three/helpers/ArrowHelper */

/**
 * ArrowHelper
 * @param {string} color Color
 */
var ArrowHelper = function ArrowHelper(color) {
  // Cylinder
  var cylinderGeometry = new _three.CylinderGeometry(0.025, 0.025, 0.8, 50);
  cylinderGeometry.translate(0, 0.4, 0);
  var cylinderMaterial = new _three.MeshBasicMaterial({
    color: color
  });
  var cylinder = new _three.Mesh(cylinderGeometry, cylinderMaterial); // Cone

  var coneGeometry = new _three.ConeGeometry(0.05, 0.2, 50);
  coneGeometry.translate(0, 0.9, 0);
  var coneMaterial = new _three.MeshBasicMaterial({
    color: color
  });
  var cone = new _three.Mesh(coneGeometry, coneMaterial); // Arrow

  var arrow = new _three.Group();
  arrow.type = 'ArrowHelper';
  arrow.add(cylinder);
  arrow.add(cone);
  /**
   * Dispose
   */

  var dispose = function dispose() {
    cylinderGeometry.dispose();
    cylinderMaterial.dispose();
    coneGeometry.dispose();
    coneMaterial.dispose();
  };

  arrow.dispose = dispose;
  return arrow;
};

var _default = ArrowHelper;
exports["default"] = _default;