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
 * Add avatar
 * @memberof module:database/avatar
 * @param {Object} data Data { name, path }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var name, path, response, avatar;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = _ref.name, path = _ref.path;
            _context.next = 3;
            return (0, _["default"])('INSERT INTO ' + _db.tables.AVATARS + ' (name, path) VALUES ($1, $2) RETURNING id', [name, path]);

          case 3:
            response = _context.sent;
            avatar = response.rows[0];
            avatar.name = name;
            return _context.abrupt("return", avatar);

          case 7:
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