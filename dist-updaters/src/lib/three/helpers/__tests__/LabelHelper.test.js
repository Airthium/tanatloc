"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _LabelHelper = _interopRequireDefault(require("../LabelHelper"));

document.createElement = function () {
  return {
    getContext: function getContext() {
      return {
        fillText: function fillText() {}
      };
    }
  };
};

describe('lib/three/helpers/LabelHelper', function () {
  test('call', function () {
    var label = (0, _LabelHelper["default"])('text');
    expect(label).toBeDefined();
  });
  test('dispose', function () {
    var label = (0, _LabelHelper["default"])('text');
    label.dispose();
  });
});