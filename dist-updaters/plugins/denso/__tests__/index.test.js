"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ = _interopRequireDefault(require(".."));

jest.mock("../model/solderFilling", function () {
  return {};
});
describe('plugins/denso', function () {
  test('exists', function () {
    expect(_["default"]).toEqual({
      category: 'Model',
      key: 'denso',
      name: 'Denso',
      models: [{}]
    });
  });
});