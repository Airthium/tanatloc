"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _storage = _interopRequireDefault(require("../../../config/storage"));

var _geometry = _interopRequireDefault(require("../../database/geometry"));

var _project = _interopRequireDefault(require("../project"));

var _tools = _interopRequireDefault(require("../tools"));

/** @module lib/geometry */

/**
 * Add geometry
 * @param {Object} param Param { project: { id }, geometry: { name, uid, buffer } }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref) {
    var project, geometry, geometryData, part, summary;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            project = _ref.project, geometry = _ref.geometry;
            _context4.next = 3;
            return _geometry["default"].add(project, {
              name: geometry.name,
              uid: geometry.uid
            });

          case 3:
            geometryData = _context4.sent;
            _context4.prev = 4;
            _context4.next = 7;
            return _tools["default"].writeFile(_storage["default"].GEOMETRY, geometryData.uploadfilename, Buffer.from(geometry.buffer).toString());

          case 7:
            _context4.next = 9;
            return _project["default"].update(project, [{
              type: 'array',
              method: 'append',
              key: 'geometries',
              value: geometryData.id
            }]);

          case 9:
            _context4.next = 11;
            return _tools["default"].convert(_storage["default"].GEOMETRY, {
              name: geometryData.uploadfilename,
              target: geometry.uid
            });

          case 11:
            part = _context4.sent;
            _context4.next = 14;
            return _tools["default"].readFile(_path["default"].join(_storage["default"].GEOMETRY, geometry.uid, 'part.json'), 'json');

          case 14:
            summary = _context4.sent;
            _context4.t0 = summary.solids;

            if (!_context4.t0) {
              _context4.next = 19;
              break;
            }

            _context4.next = 19;
            return Promise.all(summary.solids.map( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(solid) {
                var _content$data, _content$data$attribu;

                var content;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _tools["default"].readFile(_path["default"].join(_storage["default"].GEOMETRY, geometry.uid, solid.path), 'json');

                      case 2:
                        content = _context.sent;
                        solid.uuid = content.uuid;
                        if (((_content$data = content.data) === null || _content$data === void 0 ? void 0 : (_content$data$attribu = _content$data.attributes.color) === null || _content$data$attribu === void 0 ? void 0 : _content$data$attribu.itemSize) === 3) solid.color = {
                          r: content.data.attributes.color.array[0],
                          g: content.data.attributes.color.array[1],
                          b: content.data.attributes.color.array[2]
                        };
                        delete solid.path;

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 19:
            _context4.t1 = summary.faces;

            if (!_context4.t1) {
              _context4.next = 23;
              break;
            }

            _context4.next = 23;
            return Promise.all(summary.faces.map( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(face) {
                var _content$data2, _content$data2$attrib;

                var content;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _tools["default"].readFile(_path["default"].join(_storage["default"].GEOMETRY, geometry.uid, face.path), 'json');

                      case 2:
                        content = _context2.sent;
                        face.uuid = content.uuid;
                        if (((_content$data2 = content.data) === null || _content$data2 === void 0 ? void 0 : (_content$data2$attrib = _content$data2.attributes.color) === null || _content$data2$attrib === void 0 ? void 0 : _content$data2$attrib.itemSize) === 3) face.color = {
                          r: content.data.attributes.color.array[0],
                          g: content.data.attributes.color.array[1],
                          b: content.data.attributes.color.array[2]
                        };
                        delete face.path;

                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x3) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 23:
            _context4.t2 = summary.edges;

            if (!_context4.t2) {
              _context4.next = 27;
              break;
            }

            _context4.next = 27;
            return Promise.all(summary.edges.map( /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(edge) {
                var _content$data3;

                var content;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _tools["default"].readFile(_path["default"].join(_storage["default"].GEOMETRY, geometry.uid, edge.path), 'json');

                      case 2:
                        content = _context3.sent;
                        edge.uuid = content.uuid;
                        if (((_content$data3 = content.data) === null || _content$data3 === void 0 ? void 0 : _content$data3.attributes.color.itemSize) === 3) edge.color = {
                          r: content.data.attributes.color.array[0],
                          g: content.data.attributes.color.array[1],
                          b: content.data.attributes.color.array[2]
                        };
                        delete edge.path;

                      case 6:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x4) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 27:
            // Update geometry
            geometryData.json = part.json;
            geometryData.glb = part.glb;
            geometryData.summary = summary;
            _context4.next = 32;
            return _geometry["default"].update({
              id: geometryData.id
            }, [{
              key: 'glb',
              value: part.glb
            }, {
              key: 'json',
              value: part.json
            }, {
              key: 'summary',
              value: JSON.stringify(summary)
            }]);

          case 32:
            return _context4.abrupt("return", geometryData);

          case 35:
            _context4.prev = 35;
            _context4.t3 = _context4["catch"](4);
            console.warn(_context4.t3);
            console.warn('-> Delete geometry');
            _context4.next = 41;
            return del(geometryData);

          case 41:
            throw _context4.t3;

          case 42:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 35]]);
  }));

  return function add(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Get geometry
 * @param {string} id Geometry's id
 * @param {Array} data Data
 */


var get = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(id, data) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", _geometry["default"].get(id, data));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function get(_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * Update geometry
 * @param {Object} geometry Geometry { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */


var update = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(geometry, data) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _geometry["default"].update(geometry, data);

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function update(_x7, _x8) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Delete geometry
 * @param {Object} geometry Geometry { id }
 */


var del = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(geometry) {
    var geometryData;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return get(geometry.id, ['extension', 'uploadfilename', 'glb', 'json', 'project']);

          case 2:
            geometryData = _context7.sent;
            _context7.next = 5;
            return _project["default"].update({
              id: geometryData.project
            }, [{
              type: 'array',
              method: 'remove',
              key: 'geometries',
              value: geometry.id
            }]);

          case 5:
            if (!geometryData.uploadfilename) {
              _context7.next = 14;
              break;
            }

            _context7.prev = 6;
            _context7.next = 9;
            return _tools["default"].removeFile(_path["default"].join(_storage["default"].GEOMETRY, geometryData.uploadfilename));

          case 9:
            _context7.next = 14;
            break;

          case 11:
            _context7.prev = 11;
            _context7.t0 = _context7["catch"](6);
            console.warn(_context7.t0);

          case 14:
            if (!geometryData.glb) {
              _context7.next = 23;
              break;
            }

            _context7.prev = 15;
            _context7.next = 18;
            return _tools["default"].removeFile(_path["default"].join(_storage["default"].GEOMETRY, geometryData.glb));

          case 18:
            _context7.next = 23;
            break;

          case 20:
            _context7.prev = 20;
            _context7.t1 = _context7["catch"](15);
            console.warn(_context7.t1);

          case 23:
            if (!geometryData.json) {
              _context7.next = 32;
              break;
            }

            _context7.prev = 24;
            _context7.next = 27;
            return _tools["default"].removeDirectory(_path["default"].join(_storage["default"].GEOMETRY, geometryData.json));

          case 27:
            _context7.next = 32;
            break;

          case 29:
            _context7.prev = 29;
            _context7.t2 = _context7["catch"](24);
            console.warn(_context7.t2);

          case 32:
            _context7.next = 34;
            return _geometry["default"].del(geometry);

          case 34:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[6, 11], [15, 20], [24, 29]]);
  }));

  return function del(_x9) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * Read
 * @param {Object} geometry Geometry {id }
 */


var read = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(geometry) {
    var geometryData, buffer;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return get(geometry.id, ['extension', 'uploadfilename']);

          case 2:
            geometryData = _context8.sent;
            _context8.next = 5;
            return _tools["default"].readFile(_path["default"].join(_storage["default"].GEOMETRY, geometryData.uploadfilename));

          case 5:
            buffer = _context8.sent;
            return _context8.abrupt("return", {
              buffer: Buffer.from(buffer),
              extension: geometryData.extension
            });

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function read(_x10) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * Read part
 * @param {Object} geometry Geometry { id }
 */


var readPart = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(geometry) {
    var geometryData, buffer, part;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return get(geometry.id, ['glb', 'json']);

          case 2:
            geometryData = _context9.sent;
            _context9.next = 5;
            return _tools["default"].readFile(_path["default"].join(_storage["default"].GEOMETRY, geometryData.glb));

          case 5:
            buffer = _context9.sent;
            _context9.next = 8;
            return _tools["default"].readFile(_path["default"].join(_storage["default"].GEOMETRY, geometryData.json, 'part.json'), 'json');

          case 8:
            part = _context9.sent;
            return _context9.abrupt("return", {
              uuid: part.uuid,
              buffer: Buffer.from(buffer)
            });

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function readPart(_x11) {
    return _ref10.apply(this, arguments);
  };
}();

var Geometry = {
  add: add,
  get: get,
  update: update,
  del: del,
  read: read,
  readPart: readPart
};
var _default = Geometry;
exports["default"] = _default;