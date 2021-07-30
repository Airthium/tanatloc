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
 * Get all organization
 * @memberof module:database/organization
 * @param {Array} data Data
 */
var getAll = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _["default"])('SELECT ' + data.join(',') + ' FROM ' + _db.tables.ORGANIZATIONS);

          case 2:
            response = _context.sent;
            return _context.abrupt("return", response.rows);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getAll(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = getAll;
exports["default"] = _default;