"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var _threeToGlb = _interopRequireDefault(require("three-to-glb"));

var _services = _interopRequireDefault(require("../../services"));

/** @module lib/tools */

/**
 * Create path (recursive)
 * @param {string} location Location path
 */
var createPath = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(location) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _fs.promises.mkdir(location, {
              recursive: true
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createPath(_x) {
    return _ref.apply(this, arguments);
  };
}();

var listFiles = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(location) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", _fs.promises.readdir(location, {
              withFileTypes: true
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function listFiles(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Write file
 * @param {string} location Location
 * @param {string} name File name
 * @param {Object} content Content
 */


var writeFile = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(location, name, content) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return createPath(location);

          case 2:
            _context3.next = 4;
            return _fs.promises.writeFile(_path["default"].join(location, name), content);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function writeFile(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Read file
 * @param {string} file File name
 * @param {?string} type Type
 */


var readFile = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(file, type) {
    var content;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _fs.promises.readFile(file);

          case 2:
            content = _context4.sent;

            if (!(type === 'json')) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt("return", JSON.parse(content.toString()));

          case 5:
            return _context4.abrupt("return", content);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function readFile(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var copyFile = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(origin, destination) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return createPath(destination.path);

          case 2:
            _context5.next = 4;
            return _fs.promises.copyFile(_path["default"].join(origin.path, origin.file), _path["default"].join(destination.path, destination.file));

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function copyFile(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Convert file
 * @param {string} location Location
 * @param {Object} file File { name, target }
 * @param {Function?} callback Callback
 * @param {Object?} param Parameters { isResult: false }
 */


var convert = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(location, file, callback, param) {
    var origin, jsonTarget, glbTarget, _yield$Services$toThr, code, data, error, _data$trim, results, glb;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            origin = file.name;
            jsonTarget = file.target;
            glbTarget = file.target + '.glb';
            _context7.next = 5;
            return _services["default"].toThree(location, origin, jsonTarget);

          case 5:
            _yield$Services$toThr = _context7.sent;
            code = _yield$Services$toThr.code;
            data = _yield$Services$toThr.data;
            error = _yield$Services$toThr.error;
            callback && callback({
              data: data,
              error: error
            });

            if (!error) {
              _context7.next = 12;
              break;
            }

            throw new Error('Conversion process failed. Error: ' + error);

          case 12:
            if (!(code !== 0)) {
              _context7.next = 14;
              break;
            }

            throw new Error('Conversion process failed. Code ' + code);

          case 14:
            if (!(param && param.isResult)) {
              _context7.next = 20;
              break;
            }

            results = data === null || data === void 0 ? void 0 : (_data$trim = data.trim()) === null || _data$trim === void 0 ? void 0 : _data$trim.split('\n').map(function (res) {
              return JSON.parse(res);
            });
            _context7.next = 18;
            return Promise.all(results.map( /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(result) {
                var glb;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return _threeToGlb["default"].convert(_path["default"].join(location, result.path), 'part.json');

                      case 2:
                        glb = _context6.sent;
                        _context6.next = 5;
                        return writeFile(location, result.path + '.glb', glb.data);

                      case 5:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x14) {
                return _ref7.apply(this, arguments);
              };
            }()));

          case 18:
            _context7.next = 25;
            break;

          case 20:
            _context7.next = 22;
            return _threeToGlb["default"].convert(_path["default"].join(location, jsonTarget), 'part.json');

          case 22:
            glb = _context7.sent;
            _context7.next = 25;
            return writeFile(location, glbTarget, glb.data);

          case 25:
            return _context7.abrupt("return", {
              json: jsonTarget,
              glb: glbTarget
            });

          case 26:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function convert(_x10, _x11, _x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * Load part
 * @param {string} location Location
 * @param {string} name File name
 */


var loadPart = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(location, name) {
    var partFile, partData, part;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            partFile = _path["default"].join(location, name);
            _context11.next = 3;
            return _fs.promises.readFile(partFile);

          case 3:
            partData = _context11.sent;
            part = JSON.parse(partData); // Load solids

            if (!part.solids) {
              _context11.next = 8;
              break;
            }

            _context11.next = 8;
            return Promise.all(part.solids.map( /*#__PURE__*/function () {
              var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(solid) {
                var file;
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        file = _path["default"].join(location, solid.path);
                        _context8.next = 3;
                        return _fs.promises.readFile(file);

                      case 3:
                        solid.buffer = _context8.sent;
                        delete solid.path;

                      case 5:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x17) {
                return _ref9.apply(this, arguments);
              };
            }()));

          case 8:
            if (!part.faces) {
              _context11.next = 11;
              break;
            }

            _context11.next = 11;
            return Promise.all(part.faces.map( /*#__PURE__*/function () {
              var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(face) {
                var file;
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        file = _path["default"].join(location, face.path);
                        _context9.next = 3;
                        return _fs.promises.readFile(file);

                      case 3:
                        face.buffer = _context9.sent;
                        delete face.path;

                      case 5:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x18) {
                return _ref10.apply(this, arguments);
              };
            }()));

          case 11:
            if (!part.edges) {
              _context11.next = 14;
              break;
            }

            _context11.next = 14;
            return Promise.all(part.edges.map( /*#__PURE__*/function () {
              var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(edge) {
                var file;
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        file = _path["default"].join(location, edge.path);
                        _context10.next = 3;
                        return _fs.promises.readFile(file);

                      case 3:
                        edge.buffer = _context10.sent;
                        delete edge.path;

                      case 5:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x19) {
                return _ref11.apply(this, arguments);
              };
            }()));

          case 14:
            return _context11.abrupt("return", part);

          case 15:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function loadPart(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * Remove file
 * @param {string} file File name
 */


var removeFile = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(file) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _fs.promises.unlink(file);

          case 2:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function removeFile(_x20) {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * Remove directory
 * @param {string} dir Directory
 */


var removeDirectory = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(dir) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _fs.promises.rm(dir, {
              recursive: true
            });

          case 2:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function removeDirectory(_x21) {
    return _ref13.apply(this, arguments);
  };
}();

var Tools = {
  createPath: createPath,
  listFiles: listFiles,
  writeFile: writeFile,
  readFile: readFile,
  copyFile: copyFile,
  convert: convert,
  loadPart: loadPart,
  removeFile: removeFile,
  removeDirectory: removeDirectory
};
var _default = Tools;
exports["default"] = _default;