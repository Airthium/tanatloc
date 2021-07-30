"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _add = _interopRequireDefault(require("./add"));

var _getAll = _interopRequireDefault(require("./getAll"));

var _get = _interopRequireDefault(require("./get"));

var _update = _interopRequireDefault(require("./update"));

var _del = _interopRequireDefault(require("./del"));

/** @module database/organization */
var _default = {
  add: _add["default"],
  getAll: _getAll["default"],
  get: _get["default"],
  update: _update["default"],
  del: _del["default"]
};
exports["default"] = _default;