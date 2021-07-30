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
 * @memberof module:database/simulation
 * @param {Object} simulation Simulation { name, scheme, project }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var name, scheme, project, response, simulation;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = _ref.name, scheme = _ref.scheme, project = _ref.project;
            _context.next = 3;
            return (0, _["default"])('INSERT INTO ' + _db.tables.SIMULATIONS + ' (name, scheme, project) VALUES ($1, $2, $3) RETURNING id', [name, scheme, project]);

          case 3:
            response = _context.sent;
            simulation = response.rows[0];
            simulation.name = name;
            simulation.scheme = scheme;
            return _context.abrupt("return", simulation);

          case 8:
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