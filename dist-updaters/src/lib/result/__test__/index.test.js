"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _2 = _interopRequireDefault(require(".."));

var mockPath = jest.fn();
jest.mock('path', function () {
  return {
    join: function join() {
      return mockPath();
    }
  };
});
var mockCreateReadStream = jest.fn();
var mockCreateWriteStream = jest.fn();
jest.mock('fs', function () {
  return {
    createReadStream: function createReadStream() {
      return mockCreateReadStream();
    },
    createWriteStream: function createWriteStream() {
      return mockCreateWriteStream();
    }
  };
});
var mockArchiver = jest.fn();
jest.mock('archiver', function () {
  return function () {
    return mockArchiver();
  };
});
jest.mock("../../../../config/storage", function () {
  return {};
});
var mockSimulationGet = jest.fn();
jest.mock("../../simulation", function () {
  return {
    get: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", mockSimulationGet());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function get() {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  };
});
var mockReadFile = jest.fn();
var mockListFiles = jest.fn();
jest.mock("../../tools", function () {
  return {
    readFile: function () {
      var _readFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", mockReadFile());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function readFile() {
        return _readFile.apply(this, arguments);
      }

      return readFile;
    }(),
    listFiles: function () {
      var _listFiles = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", mockListFiles());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function listFiles() {
        return _listFiles.apply(this, arguments);
      }

      return listFiles;
    }()
  };
});
jest.mock("../createSummary", function () {
  return function () {
    return {
      path: 'path',
      name: 'name'
    };
  };
});
jest.mock("../createPVD", function () {
  return function () {
    return [{
      path: 'path',
      name: 'name'
    }];
  };
});
describe('lib/result', function () {
  beforeEach(function () {
    mockPath.mockReset();
    mockCreateReadStream.mockReset();
    mockCreateReadStream.mockImplementation(function () {
      return 'readStream';
    });
    mockCreateWriteStream.mockReset();
    mockCreateWriteStream.mockImplementation(function () {
      return {
        on: function on(_, callback) {
          return callback();
        },
        write: jest.fn(),
        end: jest.fn()
      };
    });
    mockArchiver.mockReset();
    mockArchiver.mockImplementation(function () {
      return {
        on: function on(type, callback) {
          if (type === 'error') return;
          if (type === 'warning') callback('Warning');
        },
        pipe: jest.fn(),
        append: jest.fn(),
        finalize: jest.fn()
      };
    });
    mockSimulationGet.mockReset();
    mockSimulationGet.mockImplementation(function () {
      return {};
    });
    mockReadFile.mockReset();
    mockReadFile.mockImplementation(function () {
      return 'readFile';
    });
    mockListFiles.mockReset();
    mockListFiles.mockImplementation(function () {
      return [{
        name: 'test.vtu',
        isFile: function isFile() {
          return true;
        }
      }, {
        name: 'test.glb',
        isFile: function isFile() {
          return true;
        }
      }];
    });
  });
  test('load', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var load;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _2["default"].load({
              simulation: {
                id: 'id'
              },
              result: {
                originPath: 'originPath',
                glb: 'glb'
              }
            });

          case 2:
            load = _context4.sent;
            expect(mockReadFile).toHaveBeenCalledTimes(1);
            expect(load).toEqual({
              buffer: Buffer.from('readFile')
            });

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test('download', function () {
    var download = _2["default"].download({
      simulation: {
        id: 'id'
      },
      result: {
        originPath: 'originPath',
        fileName: 'fileName'
      }
    });

    expect(mockCreateReadStream).toHaveBeenCalledTimes(1);
    expect(download).toBe('readStream');
  });
  test('archive', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var archive;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _2["default"].archive({
              simulation: {
                id: 'id'
              }
            });

          case 2:
            archive = _context5.sent;
            expect(mockPath).toHaveBeenCalledTimes(5);
            expect(mockSimulationGet).toHaveBeenCalledTimes(1);
            expect(mockCreateReadStream).toHaveBeenCalledTimes(4);
            expect(mockCreateWriteStream).toHaveBeenCalledTimes(1);
            expect(archive).toBe('readStream'); // Error

            mockArchiver.mockImplementation(function () {
              return {
                on: function on(type, callback) {
                  if (type === 'error') callback(new Error());
                  if (type === 'warning') callback('Warning');
                },
                pipe: jest.fn(),
                append: jest.fn(),
                finalize: jest.fn()
              };
            });
            _context5.prev = 9;
            _context5.next = 12;
            return _2["default"].archive({
              simulation: {
                id: 'id'
              }
            });

          case 12:
            expect(true).toBe(false);
            _context5.next = 18;
            break;

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5["catch"](9);
            expect(true).toBe(true);

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[9, 15]]);
  })));
});