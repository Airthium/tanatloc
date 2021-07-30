"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lib = _interopRequireDefault(require("./local/src/lib"));

var _lib2 = _interopRequireDefault(require("./rescale/src/lib"));

var _LocalAPI$key$Rescale;

var _default = (_LocalAPI$key$Rescale = {}, (0, _defineProperty2["default"])(_LocalAPI$key$Rescale, _lib["default"].key, _lib["default"]), (0, _defineProperty2["default"])(_LocalAPI$key$Rescale, _lib2["default"].key, _lib2["default"]), _LocalAPI$key$Rescale);

exports["default"] = _default;