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
 * Get user
 * @memberof module:database/group
 * @param {string} id Group's id (or key)
 * @param {Array} data Data
 */
var get = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(id, data) {
    var response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _.getter)(_db.tables.GROUPS, id, data);

          case 2:
            response = _context.sent;
            return _context.abrupt("return", response.rows[0]);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function get(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = get;
exports["default"] = _default;