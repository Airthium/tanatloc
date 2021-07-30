"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _gmsh = _interopRequireDefault(require("../gmsh"));

var mockExecSync = jest.fn();
var mockSpawn = jest.fn();
jest.mock('child_process', function () {
  return {
    execSync: function execSync() {
      return mockExecSync();
    },
    spawn: function spawn() {
      return mockSpawn();
    }
  };
});
var mockDocker = jest.fn();
jest.mock('is-docker', function () {
  return function () {
    return mockDocker();
  };
});
describe('services/gmsh', function () {
  var mockCallback = jest.fn();
  beforeEach(function () {
    mockExecSync.mockReset();
    mockExecSync.mockImplementation(function () {
      return '';
    });
    mockSpawn.mockReset();
    mockDocker.mockReset();
    mockCallback.mockReset();
  });
  test('gmsh', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var code;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Normal
            mockSpawn.mockImplementation(function () {
              return {
                stdout: {
                  on: function on(data, callback) {
                    callback('stdout');
                  }
                },
                stderr: {
                  on: function on(data, callback) {
                    callback('stderr');
                  }
                },
                on: function on(arg, callback) {
                  if (arg === 'close') callback(0);
                }
              };
            });
            _context.next = 3;
            return (0, _gmsh["default"])('path', 'fileIn', 'fileOut', mockCallback);

          case 3:
            code = _context.sent;
            expect(mockExecSync).toHaveBeenCalledTimes(2);
            expect(mockSpawn).toHaveBeenCalledTimes(1);
            expect(code).toBe(0); // Error

            _context.prev = 7;
            mockSpawn.mockImplementation(function () {
              return {
                stdout: {
                  on: function on() {}
                },
                stderr: {
                  on: function on() {}
                },
                on: function on(arg, callback) {
                  if (arg === 'error') callback('error');
                }
              };
            });
            _context.next = 11;
            return (0, _gmsh["default"])('path', 'fileIn', 'fileOut', mockCallback);

          case 11:
            code = _context.sent;
            expect(true).toBe(false);
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](7);
            expect(true).toBe(true);

          case 18:
            _context.prev = 18;
            expect(mockExecSync).toHaveBeenCalledTimes(4);
            expect(mockSpawn).toHaveBeenCalledTimes(2);
            return _context.finish(18);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 15, 18, 22]]);
  })));
  test('isDocker', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var code;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mockDocker.mockImplementation(function () {
              return true;
            });
            mockSpawn.mockImplementation(function () {
              return {
                stdout: {
                  on: function on(data, callback) {
                    callback('stdout');
                  }
                },
                stderr: {
                  on: function on(data, callback) {
                    callback('stderr');
                  }
                },
                on: function on(arg, callback) {
                  if (arg === 'close') callback(0);
                }
              };
            });
            _context2.next = 4;
            return (0, _gmsh["default"])('path', 'fileIn', 'fileOut', mockCallback);

          case 4:
            code = _context2.sent;
            expect(mockExecSync).toHaveBeenCalledTimes(0);
            expect(mockSpawn).toHaveBeenCalledTimes(1);
            expect(code).toBe(0);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});