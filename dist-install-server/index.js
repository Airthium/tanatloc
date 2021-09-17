"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Server build directory
var serverDir = process.argv.pop();
/**
 * List files
 * @param {string} base Base path
 * @returns {Array} Files list
 */

var listFiles = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(base) {
    var files;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _fs.promises.readdir(base, {
              withFileTypes: true
            });

          case 2:
            files = _context2.sent;
            files.forEach(function (file) {
              file.name = _path["default"].join(base, file.name);
              file.location = base;
            });
            _context2.next = 6;
            return Promise.all(files.map( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
                var newFiles;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!file.isDirectory()) {
                          _context.next = 5;
                          break;
                        }

                        _context.next = 3;
                        return listFiles(file.name);

                      case 3:
                        newFiles = _context.sent;
                        files.push.apply(files, (0, _toConsumableArray2["default"])(newFiles));

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 6:
            return _context2.abrupt("return", files);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function listFiles(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Copy ejs files
 * @param {string} base Base path
 */


var copyEjs = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(base) {
    var files, ejsFiles, _iterator, _step, ejsFile;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return listFiles(base);

          case 2:
            files = _context3.sent;
            ejsFiles = files.filter(function (file) {
              return file.name.includes('.ejs');
            }).map(function (file) {
              return {
                name: file.name,
                location: file.location
              };
            });
            _iterator = _createForOfIteratorHelper(ejsFiles);
            _context3.prev = 5;

            _iterator.s();

          case 7:
            if ((_step = _iterator.n()).done) {
              _context3.next = 24;
              break;
            }

            ejsFile = _step.value;
            _context3.prev = 9;
            _context3.next = 12;
            return _fs.promises.stat(_path["default"].join(serverDir, ejsFile.location));

          case 12:
            _context3.next = 19;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](9);

            if (!(_context3.t0.code === 'ENOENT')) {
              _context3.next = 19;
              break;
            }

            _context3.next = 19;
            return _fs.promises.mkdir(_path["default"].join(serverDir, ejsFile.location));

          case 19:
            // Copy file
            console.info(' - copy ' + ejsFile.name);
            _context3.next = 22;
            return _fs.promises.copyFile(ejsFile.name, _path["default"].join(serverDir, ejsFile.name));

          case 22:
            _context3.next = 7;
            break;

          case 24:
            _context3.next = 29;
            break;

          case 26:
            _context3.prev = 26;
            _context3.t1 = _context3["catch"](5);

            _iterator.e(_context3.t1);

          case 29:
            _context3.prev = 29;

            _iterator.f();

            return _context3.finish(29);

          case 32:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 26, 29, 32], [9, 14]]);
  }));

  return function copyEjs(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Copy all ejs files
 */


var copyAllEjs = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.info('Templates'); // Check in templates

            _context4.next = 3;
            return copyEjs('templates');

          case 3:
            _context4.next = 5;
            return copyEjs('plugins');

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function copyAllEjs() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Main
 */


var main = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return copyAllEjs();

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function main() {
    return _ref5.apply(this, arguments);
  };
}();

main()["catch"](console.error);