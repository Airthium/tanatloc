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
 * @memberof module:database/user
 * @param {string} id User's id (or key)
 * @param {Array} data Data
 * @param {string} key Key (override id selector)
 */
var get = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(id, data) {
    var key,
        response,
        user,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            key = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'id';
            _context.next = 3;
            return (0, _.getter)(_db.tables.USERS, id, data, key);

          case 3:
            response = _context.sent;
            user = response.rows[0];
            user && (user[key] = id);
            return _context.abrupt("return", user);

          case 7:
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