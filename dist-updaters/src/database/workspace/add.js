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
 * @memberof module:database/workspace
 * @param {string} user User { id }
 * @param {Object} workspace Workspace { name }
 */
var add = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref, _ref2) {
    var id, name, response, workspace;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = _ref.id;
            name = _ref2.name;
            _context.next = 4;
            return (0, _["default"])('INSERT INTO ' + _db.tables.WORKSPACES + ' (name, owners, projects) VALUES ($1, $2, $3) RETURNING id', [name, [id], []]);

          case 4:
            response = _context.sent;
            workspace = response.rows[0];
            workspace.name = name;
            return _context.abrupt("return", workspace);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function add(_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();

var _default = add;
exports["default"] = _default;