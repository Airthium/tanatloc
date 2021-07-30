"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require(".."));

var _db = require("../../../config/db");

/**
 * Add
 * @param {Object} organization Organization
 * @param {Object} group Group { name, users }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(organization, _ref) {
    var name, users, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = _ref.name, users = _ref.users;
            _context.next = 3;
            return (0, _["default"])('INSERT INTO ' + _db.tables.GROUPS + ' (name, users, organization) VALUES ($1, $2, $3) RETURNING id', [name, users, organization.id]);

          case 3:
            response = _context.sent;
            return _context.abrupt("return", response.rows[0]);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function add(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = add;
exports["default"] = _default;