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
 * Update
 * @memberof module:database/project
 * @param {Object} project Project { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
var update = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(project, data) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", (0, _.updater)(_db.tables.PROJECTS, project.id, data));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function update(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = update;
exports["default"] = _default;