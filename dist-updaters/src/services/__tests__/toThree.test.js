"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toThree = _interopRequireDefault(require("../toThree"));

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
describe('services/toThree', function () {
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
  test('toThree', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var res;
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
            }); // Step

            _context.next = 3;
            return (0, _toThree["default"])('path', 'file.step', 'pathout', mockCallback);

          case 3:
            res = _context.sent;
            expect(mockExecSync).toHaveBeenCalledTimes(2);
            expect(mockSpawn).toHaveBeenCalledTimes(1);
            expect(res.code).toBe(0);
            _context.next = 9;
            return (0, _toThree["default"])('path', 'file.stp', 'pathout', mockCallback);

          case 9:
            res = _context.sent;
            expect(mockExecSync).toHaveBeenCalledTimes(4);
            expect(mockSpawn).toHaveBeenCalledTimes(2);
            expect(res.code).toBe(0); // Dxf

            _context.next = 15;
            return (0, _toThree["default"])('path', 'file.dxf', 'pathout', mockCallback);

          case 15:
            res = _context.sent;
            expect(mockExecSync).toHaveBeenCalledTimes(6);
            expect(mockSpawn).toHaveBeenCalledTimes(3);
            expect(res.code).toBe(0); // Msh

            _context.next = 21;
            return (0, _toThree["default"])('path', 'file.msh', 'pathout', mockCallback);

          case 21:
            res = _context.sent;
            expect(mockExecSync).toHaveBeenCalledTimes(8);
            expect(mockSpawn).toHaveBeenCalledTimes(4);
            expect(res.code).toBe(0); // VTU

            _context.next = 27;
            return (0, _toThree["default"])('path', 'file.vtu', 'pathout', mockCallback);

          case 27:
            res = _context.sent;
            expect(mockExecSync).toHaveBeenCalledTimes(10);
            expect(mockSpawn).toHaveBeenCalledTimes(5);
            expect(res.code).toBe(0); // Unknow

            _context.prev = 31;
            _context.next = 34;
            return (0, _toThree["default"])('path', 'file.other', 'pathout', mockCallback);

          case 34:
            expect(true).toBe(false);
            _context.next = 40;
            break;

          case 37:
            _context.prev = 37;
            _context.t0 = _context["catch"](31);
            expect(true).toBe(true);

          case 40:
            _context.prev = 40;
            expect(mockExecSync).toHaveBeenCalledTimes(10);
            expect(mockSpawn).toHaveBeenCalledTimes(5);
            return _context.finish(40);

          case 44:
            _context.prev = 44;
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
            _context.next = 48;
            return (0, _toThree["default"])('path', 'file.step', 'pathout', mockCallback);

          case 48:
            expect(true).toBe(false);
            _context.next = 54;
            break;

          case 51:
            _context.prev = 51;
            _context.t1 = _context["catch"](44);
            expect(true).toBe(true);

          case 54:
            _context.prev = 54;
            expect(mockExecSync).toHaveBeenCalledTimes(12);
            expect(mockSpawn).toHaveBeenCalledTimes(6);
            return _context.finish(54);

          case 58:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[31, 37, 40, 44], [44, 51, 54, 58]]);
  })));
  test('isDocker', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var res;
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
            return (0, _toThree["default"])('path', 'file.step', 'pathour', mockCallback);

          case 4:
            res = _context2.sent;
            expect(mockExecSync).toHaveBeenCalledTimes(0);
            expect(mockSpawn).toHaveBeenCalledTimes(1);
            expect(res.code).toBe(0);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});