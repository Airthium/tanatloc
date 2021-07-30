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
 * @memberof module:database/geometry
 * @param {Object} project Project { id }
 * @param {Object} geometry Geometry { name, uid }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(project, _ref) {
    var name, uid, extension, uploadFileName, response, geometry;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = _ref.name, uid = _ref.uid;
            extension = name.split('.').pop();
            uploadFileName = uid + '.' + extension;
            _context.next = 5;
            return (0, _["default"])('INSERT INTO ' + _db.tables.GEOMETRIES + ' (name, originalfilename, extension, uploadfilename, project) VALUES ($1, $1, $2, $3, $4) RETURNING id', [name, extension, uploadFileName, project.id]);

          case 5:
            response = _context.sent;
            geometry = response.rows[0];
            geometry.name = name;
            geometry.originalfilename = name;
            geometry.extension = extension;
            geometry.uploadfilename = uploadFileName;
            return _context.abrupt("return", geometry);

          case 12:
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