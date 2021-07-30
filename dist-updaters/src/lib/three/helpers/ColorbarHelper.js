"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorbarHelper = void 0;

var _three = require("three");

var _LabelHelper = _interopRequireDefault(require("./LabelHelper"));

/** @module lib/three/helpers/ColorbarHelper */

/**
 * Colorbar helper
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 */
var ColorbarHelper = function ColorbarHelper(renderer, scene) {
  var width = 50;
  var height = 500;
  var colorScene = new _three.Scene();
  var colorCamera = new _three.OrthographicCamera(-1, 1, 1, -1, 1, 2);
  colorCamera.position.set(-0.5, 0, 1);
  var sprite;
  /**
   * Set visible
   * @param {bool} visible Visible
   */

  var setVisible = function setVisible(visible) {
    colorScene.children.forEach(function (child) {
      child.visible = visible;
    });
  };
  /**
   * Clean scene (local)
   */


  var clearScene = function clearScene() {
    colorScene.children.forEach(function (child) {
      child.dispose();
    });
    colorScene.clear();
  };
  /**
   * Set LUT
   * @param {Object} lut LUT
   */


  var setLUT = function setLUT(lut) {
    clearScene();
    var map = new _three.CanvasTexture(lut.createCanvas());
    var material = new _three.SpriteMaterial({
      map: map
    });
    sprite = new _three.Sprite(material);
    sprite.scale.x = 0.2;
    sprite.scale.y = 2;
    sprite.position.set(-1, 0, 0);
    sprite.dispose = sprite.material.dispose;
    colorScene.add(sprite);
    setLabels(lut);
  };
  /**
   * Set labels
   * @param {Object} lut LUT
   */


  var setLabels = function setLabels(lut) {
    var min = Math.abs(lut.minV) > 1e-12 ? Math.abs(lut.minV) > 1000 || Math.abs(lut.minV) < 0.001 ? lut.minV.toExponential(2) : lut.minV.toFixed(3) : 0;
    var max = Math.abs(lut.maxV) > 1e-12 ? Math.abs(lut.maxV) > 1000 || Math.abs(lut.maxV) < 0.001 ? lut.maxV.toExponential(2) : lut.maxV.toFixed(3) : 0;
    var minLabel = (0, _LabelHelper["default"])(min, 768, 'gray', 128);
    minLabel.scale.x = 1;
    minLabel.scale.y = 0.3;
    minLabel.position.set(-0.45, -0.95, 0);
    var maxLabel = (0, _LabelHelper["default"])(max, 768, 'gray', 128);
    maxLabel.scale.x = 1;
    maxLabel.scale.y = 0.3;
    maxLabel.position.set(-0.45, 0.95, 0);
    colorScene.add(minLabel);
    colorScene.add(maxLabel);
  };
  /**
   * Render
   */


  var render = function render() {
    var rect = renderer.domElement.getBoundingClientRect();
    renderer.setViewport(rect.width - width - 100, rect.height / 2 - height / 2, width + 100, height);
    renderer.render(colorScene, colorCamera);
  };

  return {
    setVisible: setVisible,
    setLUT: setLUT,
    render: render
  };
};

exports.ColorbarHelper = ColorbarHelper;