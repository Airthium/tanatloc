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
 * Update system items
 * @memberof module:database/system
 * @param {Object} data Data [{ key, value }, ...]
 */
var update = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _.updater)(_db.tables.SYSTEM, 0, data));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function update(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = update;
exports["default"] = _default;