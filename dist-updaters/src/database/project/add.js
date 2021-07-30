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
 * @memberof module:database/project
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { title, description }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user, workspace, _ref) {
    var title, description, response, project;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            title = _ref.title, description = _ref.description;
            _context.next = 3;
            return (0, _["default"])('INSERT INTO ' + _db.tables.PROJECTS + ' (title, description, public, createdDate, lastAccess, owners, workspace) VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($4), $5, $6) RETURNING id', [title, description || '', false, Date.now() / 1000, [user.id], workspace.id]);

          case 3:
            response = _context.sent;
            project = response.rows[0];
            project.title = title;
            project.description = description || '';
            return _context.abrupt("return", project);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function add(_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = add;
exports["default"] = _default;