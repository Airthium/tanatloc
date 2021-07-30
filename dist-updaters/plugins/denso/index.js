"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _solderFilling = _interopRequireDefault(require("./model/solderFilling"));

var Denso = {
  category: 'Model',
  key: 'denso',
  name: 'Denso',
  models: [_solderFilling["default"]]
};
var _default = Denso;
exports["default"] = _default;