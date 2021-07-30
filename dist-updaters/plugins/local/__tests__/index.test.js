"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ = _interopRequireDefault(require("../"));

describe('plugins/local', function () {
  test('call', function () {
    expect(_["default"]).toBeDefined();
    expect(_["default"].key).toBeDefined();
  });
});