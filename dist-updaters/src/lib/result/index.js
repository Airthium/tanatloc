"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _archiver = _interopRequireDefault(require("archiver"));

var _storage = _interopRequireDefault(require("../../../config/storage"));

var _simulation = _interopRequireDefault(require("../simulation"));

var _tools = _interopRequireDefault(require("../tools"));

var _createSummary = _interopRequireDefault(require("./createSummary"));

var _createPVD = _interopRequireDefault(require("./createPVD"));

/** @module lib/geometry */
var archiveFileName = 'resultsArchive.zip';
/**
 * Load
 * @param {Object} param Parameters { simulation: { id }, result: { originPath, glb } }
 */

var load = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var simulation, result, buffer;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            simulation = _ref.simulation, result = _ref.result;
            _context.next = 3;
            return _tools["default"].readFile(_path["default"].join(_storage["default"].SIMULATION, simulation.id, result.originPath, result.glb));

          case 3:
            buffer = _context.sent;
            return _context.abrupt("return", {
              buffer: Buffer.from(buffer)
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function load(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Download
 * @param {Object} param Parameters { simulation: { id }, result { originPath, fileName } }
 */


var download = function download(_ref3) {
  var simulation = _ref3.simulation,
      result = _ref3.result;
  return _fs["default"].createReadStream(_path["default"].join(_storage["default"].SIMULATION, simulation.id, result.originPath, result.fileName));
};
/**
 * Archive
 * @param {Object} param Parameters { simulation: { id } }
 */


var archive = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref4) {
    var simulation, resultPath, archiveName, filesDirents, files, simulationScheme, summary, pvdFiles, output, zip;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            simulation = _ref4.simulation;
            resultPath = _path["default"].join(_storage["default"].SIMULATION, simulation.id, 'run', 'result');
            archiveName = _path["default"].join(_storage["default"].SIMULATION, simulation.id, 'run', archiveFileName); // Get result files

            _context5.next = 5;
            return _tools["default"].listFiles(resultPath);

          case 5:
            filesDirents = _context5.sent;
            files = filesDirents.filter(function (dirent) {
              return dirent.isFile();
            }).map(function (dirent) {
              return dirent.name;
            }); // Summary

            _context5.next = 9;
            return _simulation["default"].get(simulation.id, ['name', 'scheme']);

          case 9:
            simulationScheme = _context5.sent;
            summary = (0, _createSummary["default"])(simulationScheme); // PVD files

            pvdFiles = (0, _createPVD["default"])(simulationScheme, files); // Create zip

            output = _fs["default"].createWriteStream(archiveName);
            zip = (0, _archiver["default"])('zip');
            _context5.next = 16;
            return new Promise( /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(resolve, reject) {
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        zip.on('warning', function (err) {
                          return console.warn(err);
                        });
                        zip.on('error', function (err) {
                          return reject(err);
                        });
                        zip.pipe(output); // Append files

                        _context4.next = 5;
                        return Promise.all(files.map( /*#__PURE__*/function () {
                          var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(file) {
                            var extension;
                            return _regenerator["default"].wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    extension = file.split('.').pop();

                                    if (!(extension === 'vtu')) {
                                      _context2.next = 4;
                                      break;
                                    }

                                    _context2.next = 4;
                                    return zip.append(_fs["default"].createReadStream(_path["default"].join(resultPath, file)), {
                                      name: _path["default"].join('result', file)
                                    });

                                  case 4:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x5) {
                            return _ref7.apply(this, arguments);
                          };
                        }()));

                      case 5:
                        _context4.next = 7;
                        return zip.append(_fs["default"].createReadStream(summary.path), {
                          name: summary.name
                        });

                      case 7:
                        _context4.next = 9;
                        return Promise.all(pvdFiles.map( /*#__PURE__*/function () {
                          var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(file) {
                            return _regenerator["default"].wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return zip.append(_fs["default"].createReadStream(file.path), {
                                      name: file.name
                                    });

                                  case 2:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function (_x6) {
                            return _ref8.apply(this, arguments);
                          };
                        }()));

                      case 9:
                        output.on('close', resolve); // Finalize

                        _context4.next = 12;
                        return zip.finalize();

                      case 12:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x3, _x4) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 16:
            return _context5.abrupt("return", _fs["default"].createReadStream(_path["default"].join(_storage["default"].SIMULATION, simulation.id, 'run', archiveFileName)));

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function archive(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

var Result = {
  load: load,
  archive: archive,
  download: download
};
var _default = Result;
exports["default"] = _default;