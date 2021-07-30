"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ArrowHelper = _interopRequireDefault(require("../ArrowHelper"));

describe('lib/three/helpers/ArrowHelper', function () {
  test('call', function () {
    var arrow = (0, _ArrowHelper["default"])('red');
    expect(arrow).toBeDefined();
  });
  test('dispose', function () {
    var arrow = (0, _ArrowHelper["default"])('red');
    arrow.dispose();
  });
});