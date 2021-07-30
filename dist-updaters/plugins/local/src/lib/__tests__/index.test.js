"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require(".."));

var mockPath = jest.fn();
jest.mock('path', function () {
  return {
    join: function join() {
      return mockPath();
    }
  };
});
var mockSetInterval = jest.fn();
jest.mock('set-interval-async/fixed', function () {
  return {
    setIntervalAsync: function setIntervalAsync(func) {
      return mockSetInterval(func);
    }
  };
});
jest.mock('set-interval-async', function () {
  return {
    clearIntervalAsync: function clearIntervalAsync() {}
  };
});
jest.mock("../../../../../config/storage", function () {
  return {};
});
var mockUpdate = jest.fn();
jest.mock("../../../../../src/database/simulation", function () {
  return {
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", mockUpdate());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockCreatePath = jest.fn();
var mockReadFile = jest.fn();
var mockConvert = jest.fn();
jest.mock("../../../../../src/lib/tools", function () {
  return {
    createPath: function () {
      var _createPath = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", mockCreatePath());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function createPath() {
        return _createPath.apply(this, arguments);
      }

      return createPath;
    }(),
    readFile: function () {
      var _readFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", mockReadFile());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function readFile() {
        return _readFile.apply(this, arguments);
      }

      return readFile;
    }(),
    convert: function () {
      var _convert = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(path, file, callback, param) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockConvert(path, file, callback, param));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function convert(_x, _x2, _x3, _x4) {
        return _convert.apply(this, arguments);
      }

      return convert;
    }()
  };
});
var mockRender = jest.fn();
jest.mock("../../../../../src/lib/template", function () {
  return {
    render: function () {
      var _render = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockRender());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  };
});
var mockGmsh = jest.fn();
var mockFreefem = jest.fn();
jest.mock("../../../../../src/services", function () {
  return {
    gmsh: function () {
      var _gmsh = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(path, mesh, geometry, callback) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", mockGmsh(path, mesh, geometry, callback));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function gmsh(_x5, _x6, _x7, _x8) {
        return _gmsh.apply(this, arguments);
      }

      return gmsh;
    }(),
    freefem: function () {
      var _freefem = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(path, script, callback) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockFreefem(path, script, callback));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function freefem(_x9, _x10, _x11) {
        return _freefem.apply(this, arguments);
      }

      return freefem;
    }()
  };
});
describe('plugins/local/src/lib', function () {
  beforeEach(function () {
    mockPath.mockReset();
    mockSetInterval.mockReset();
    mockUpdate.mockReset();
    mockConvert.mockReset();
    mockCreatePath.mockReset();
    mockReadFile.mockReset();
    mockRender.mockReset();
    mockGmsh.mockReset();
    mockFreefem.mockReset();
  });
  test('key', function () {
    expect(_["default"].key).toBeDefined();
  });
  test('computeMesh', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var data;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            // Normal
            mockPath.mockImplementation(function () {
              return 'partPath';
            });
            mockGmsh.mockImplementation(function () {
              return 0;
            });
            mockConvert.mockImplementation(function (path, file, callback) {
              callback({});
              return {
                json: 'json',
                glb: 'glb'
              };
            });
            _context8.next = 5;
            return _["default"].computeMesh('path', {
              path: 'path',
              name: 'name',
              file: 'file'
            }, {
              path: 'path'
            }, jest.fn());

          case 5:
            data = _context8.sent;
            expect(data).toEqual({
              type: 'mesh',
              originPath: 'path',
              renderPath: 'path',
              fileName: 'name.msh',
              json: 'json',
              glb: 'glb'
            }); // Mesh convert error

            mockConvert.mockImplementation(function () {
              throw new Error();
            });
            _context8.prev = 8;
            _context8.next = 11;
            return _["default"].computeMesh('path', {
              path: 'path',
              name: 'name',
              file: 'file'
            }, {
              path: 'path'
            }, jest.fn());

          case 11:
            expect(true).toBe(false);
            _context8.next = 17;
            break;

          case 14:
            _context8.prev = 14;
            _context8.t0 = _context8["catch"](8);
            expect(true).toBe(true);

          case 17:
            _context8.prev = 17;
            mockConvert.mockImplementation(function () {
              return {};
            });
            return _context8.finish(17);

          case 20:
            // Error
            mockGmsh.mockReset();
            _context8.prev = 21;
            _context8.next = 24;
            return _["default"].computeMesh('path', {
              path: 'path',
              name: 'name',
              file: 'file'
            }, {
              path: 'path'
            }, jest.fn());

          case 24:
            expect(true).toBe(false);
            _context8.next = 30;
            break;

          case 27:
            _context8.prev = 27;
            _context8.t1 = _context8["catch"](21);
            expect(true).toBe(true);

          case 30:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[8, 14, 17, 20], [21, 27]]);
  })));
  test('computeSimulation', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var processOutput;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            mockFreefem.mockImplementation(function (path, script, callback) {
              callback({
                pid: 'pid'
              });
              callback({
                error: 'data'
              });
              return 0;
            }); // Empty

            _context9.next = 3;
            return _["default"].computeSimulation('id', 'algorithm', {});

          case 3:
            // Simulation error
            Date.now = function () {
              return 0;
            };

            mockFreefem.mockImplementation(function (path, file, callback) {
              callback({});
              return 1;
            });
            _context9.prev = 5;
            _context9.next = 8;
            return _["default"].computeSimulation('id', 'algorithm', {});

          case 8:
            expect(true).toBe(false);
            _context9.next = 14;
            break;

          case 11:
            _context9.prev = 11;
            _context9.t0 = _context9["catch"](5);
            expect(true).toBe(true);

          case 14:
            //With meshes
            Date.now = function () {
              return NaN;
            };

            mockFreefem.mockImplementation(function () {
              return 0;
            });
            mockGmsh.mockImplementation(function (path, mesh, geometry, callback) {
              callback({
                pid: 'pid'
              });
              callback({
                data: 'data'
              });
              callback({
                error: 'data'
              });
              return 0;
            });
            mockConvert.mockImplementation(function () {
              return {};
            });
            _context9.next = 20;
            return _["default"].computeSimulation('id', 'algorithm', {
              geometry: {
                meshable: true,
                name: 'name',
                path: 'path',
                file: 'file'
              },
              geometry2: {
                meshable: false,
                name: 'name',
                path: 'path',
                file: 'file'
              },
              boundaryConditions: {
                index: 0,
                key1: {},
                key2: {
                  values: [{
                    selected: [1]
                  }],
                  refineFactor: 5
                }
              }
            });

          case 20:
            // Meshing error
            Date.now = function () {
              return 0;
            };

            mockGmsh.mockImplementation(function (path, mesh, geometry, callback) {
              callback({
                pid: 'pid'
              });
              callback({
                data: 'data'
              });
              callback({
                error: 'data'
              });
              return 1;
            });
            _context9.prev = 22;
            _context9.next = 25;
            return _["default"].computeSimulation('id', 'algorithm', {
              geometry: {
                meshable: true,
                file: {
                  originPath: 'originPath',
                  fileName: 'fileName'
                }
              },
              geometry2: {
                meshable: false
              },
              boundaryConditions: {
                index: 0,
                key1: {},
                key2: {
                  values: [{
                    selected: [1]
                  }],
                  refineFactor: 5
                }
              }
            });

          case 25:
            expect(true).toBe(false);
            _context9.next = 31;
            break;

          case 28:
            _context9.prev = 28;
            _context9.t1 = _context9["catch"](22);
            expect(true).toBe(true);

          case 31:
            mockSetInterval.mockImplementation(function (func) {
              processOutput = func;
              return 1;
            });
            mockFreefem.mockImplementation(function (path, file, callback) {
              callback({});
              callback({});
              return 0;
            });
            mockGmsh.mockImplementation(function () {
              return 0;
            });
            mockReadFile.mockImplementation(function () {
              throw new Error();
            });
            _context9.next = 37;
            return _["default"].computeSimulation('id', 'algorithm', {});

          case 37:
            _context9.next = 39;
            return processOutput();

          case 39:
            // With results & data
            JSON.parse = function () {
              return {};
            };

            mockReadFile.mockImplementation(function () {
              return 'PROCESS VTU FILE Result.vtu\nPROCESS DATA FILE data.dat';
            });
            mockConvert.mockImplementation(function (path, file, callback) {
              callback({
                data: 'data'
              });
            });
            _context9.next = 44;
            return processOutput();

          case 44:
            _context9.next = 46;
            return processOutput();

          case 46:
            // Convert stderr
            JSON.parse = function () {
              throw new Error();
            };

            mockReadFile.mockImplementation(function () {
              return 'PROCESS VTU FILE Result1.vtu\nPROCESS DATA FILE data1.dat';
            });
            mockConvert.mockImplementation(function (path, file, callback) {
              callback({
                error: 'error'
              });
            });
            _context9.next = 51;
            return processOutput();

          case 51:
            // Convert error
            mockReadFile.mockImplementation(function () {
              return 'PROCESS VTU FILE Result2.vtu\nPROCESS DATA FILE data2.dat';
            });
            mockConvert.mockImplementation(function () {
              throw new Error();
            });
            _context9.next = 55;
            return processOutput();

          case 55:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[5, 11], [22, 28]]);
  })));
  test('stop', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var mockKill;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            mockKill = jest.spyOn(process, 'kill').mockImplementation(function () {});
            _context10.next = 3;
            return _["default"].stop([{
              status: 'wait'
            }, {
              status: 'process'
            }]);

          case 3:
            expect(mockKill).toHaveBeenCalledTimes(1);

          case 4:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  })));
});