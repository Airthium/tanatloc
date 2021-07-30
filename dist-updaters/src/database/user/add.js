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
 * @memberof module:database/user
 * @param {Object} user User { email, password }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var email, password, existing, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = _ref.email, password = _ref.password;
            _context.next = 3;
            return (0, _["default"])('SELECT id FROM ' + _db.tables.USERS + ' WHERE email = $1', [email]);

          case 3:
            existing = _context.sent;

            if (!existing.rows.length) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", {
              alreadyExists: true
            });

          case 6:
            _context.next = 8;
            return (0, _["default"])('INSERT INTO ' + _db.tables.USERS + " (email, password, isvalidated, lastmodificationdate, superuser) VALUES ($1, crypt($2, gen_salt('bf')), $3, to_timestamp($4), $5) returning id", [email, password, false, Date.now(), false]);

          case 8:
            response = _context.sent;
            return _context.abrupt("return", response.rows[0]);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function add(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = add;
exports["default"] = _default;