"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _add = _interopRequireDefault(require("./add"));

var _get = _interopRequireDefault(require("./get"));

var _del = _interopRequireDefault(require("./del"));

/** @module database/link */
var _default = {
  add: _add["default"],
  get: _get["default"],
  del: _del["default"]
};
exports["default"] = _default;