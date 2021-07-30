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
 * Get by email and password
 * @memberof module:database/user
 * @param {Object} user User { email, password }
 */
var getByUsernameAndPassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var email, password, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = _ref.email, password = _ref.password;
            _context.next = 3;
            return (0, _["default"])('SELECT id, isvalidated FROM ' + _db.tables.USERS + ' WHERE email = $1 AND password = crypt($2, password)', [email, password]);

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

  return function getByUsernameAndPassword(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = getByUsernameAndPassword;
exports["default"] = _default;