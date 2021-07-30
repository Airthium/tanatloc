"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ = _interopRequireDefault(require(".."));

describe('plugins/denso/template', function () {
  test('exists', function () {
    expect(_["default"]).toEqual({
      key: 'denso',
      path: './plugins/denso/template',
      templates: [{
        key: 'solderFilling',
        file: 'solderFilling.edp.ejs'
      }]
    });
  });
});