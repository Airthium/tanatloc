"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toThree = _interopRequireDefault(require("./toThree"));

var _gmsh = _interopRequireDefault(require("./gmsh"));

var _freefem = _interopRequireDefault(require("./freefem"));

/** @module services */
var _default = {
  toThree: _toThree["default"],
  gmsh: _gmsh["default"],
  freefem: _freefem["default"]
};
exports["default"] = _default;