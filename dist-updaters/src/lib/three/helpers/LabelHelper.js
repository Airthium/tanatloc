"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _three = require("three");

/** @module lib/three/helpers/LabelHelper */

/**
 * LabelHelper
 * @param {string} text Text
 * @param {number} size Size
 * @param {string} fontColor Font color
 * @param {number} fontSize Font size
 */
var LabelHelper = function LabelHelper(text) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 512;
  var fontColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';
  var fontSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 512;
  // Canvas
  var canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  var context = canvas.getContext('2d');
  context.fillStyle = fontColor;
  context.font = fontSize + 'px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2); // Texture

  var texture = new _three.Texture(canvas);
  texture.needsUpdate = true; // Label

  var material = new _three.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false
  });
  var label = new _three.Sprite(material);
  label.type = 'LabelHelper';
  /**
   * Dispose
   */

  var dispose = function dispose() {
    texture.dispose();
    material.dispose();
  };

  label.dispose = dispose;
  return label;
};

var _default = LabelHelper;
exports["default"] = _default;