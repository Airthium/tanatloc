"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = require("..");

var _db = require("../../../config/db");

/**
 * Delete geometry
 * @memberof module:database/geometry
 * @param {Object} geometry Geometry { id }
 */
var del = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(geometry) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _.deleter)(_db.tables.GEOMETRIES, geometry.id);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function del(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = del;
exports["default"] = _default;