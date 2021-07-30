"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require("../"));

var mockPath = jest.fn();
jest.mock('path', function () {
  return {
    join: function join() {
      return mockPath();
    }
  };
});
var mockMkdir = jest.fn();
var mockReadDir = jest.fn();
var mockWriteFile = jest.fn();
var mockReadFile = jest.fn();
var mockCopyFile = jest.fn();
var mockUnlink = jest.fn();
var mockRmdir = jest.fn();
jest.mock('fs', function () {
  return {
    promises: {
      mkdir: function () {
        var _mkdir = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", mockMkdir());

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function mkdir() {
          return _mkdir.apply(this, arguments);
        }

        return mkdir;
      }(),
      readdir: function () {
        var _readdir = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", mockReadDir());

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function readdir() {
          return _readdir.apply(this, arguments);
        }

        return readdir;
      }(),
      writeFile: function () {
        var _writeFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
          return _regenerator["default"].wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  return _context3.abrupt("return", mockWriteFile());

                case 1:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function writeFile() {
          return _writeFile.apply(this, arguments);
        }

        return writeFile;
      }(),
      readFile: function () {
        var _readFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
          return _regenerator["default"].wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  return _context4.abrupt("return", mockReadFile());

                case 1:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function readFile() {
          return _readFile.apply(this, arguments);
        }

        return readFile;
      }(),
      copyFile: function () {
        var _copyFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
          return _regenerator["default"].wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  return _context5.abrupt("return", mockCopyFile());

                case 1:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        function copyFile() {
          return _copyFile.apply(this, arguments);
        }

        return copyFile;
      }(),
      unlink: function () {
        var _unlink = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
          return _regenerator["default"].wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  return _context6.abrupt("return", mockUnlink());

                case 1:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        function unlink() {
          return _unlink.apply(this, arguments);
        }

        return unlink;
      }(),
      rm: function () {
        var _rm = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
          return _regenerator["default"].wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  return _context7.abrupt("return", mockRmdir());

                case 1:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));

        function rm() {
          return _rm.apply(this, arguments);
        }

        return rm;
      }()
    }
  };
});
var mockThreeToGLB = jest.fn();
jest.mock('three-to-glb', function () {
  return {
    convert: function convert() {
      return mockThreeToGLB();
    }
  };
});
var mockToThree = jest.fn();
jest.mock("../../../services", function () {
  return {
    toThree: function () {
      var _toThree = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(path, fileIn, pathOut) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockToThree(path, fileIn, pathOut));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function toThree(_x, _x2, _x3) {
        return _toThree.apply(this, arguments);
      }

      return toThree;
    }()
  };
});
describe('lib/tools', function () {
  beforeEach(function () {
    mockPath.mockReset();
    mockMkdir.mockReset();
    mockReadDir.mockReset();
    mockWriteFile.mockReset();
    mockReadFile.mockReset();
    mockCopyFile.mockReset();
    mockReadFile.mockImplementation(function () {
      return 'readFile';
    });
    mockUnlink.mockReset();
    mockRmdir.mockReset();
    mockThreeToGLB.mockReset();
    mockThreeToGLB.mockImplementation(function () {
      return {};
    });
    mockToThree.mockReset();
  });
  test('createPath', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _["default"].createPath('location');

          case 2:
            expect(mockMkdir).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
  test('listFiles', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var files;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            mockReadDir.mockImplementation(function () {
              return ['file'];
            });
            _context10.next = 3;
            return _["default"].listFiles('location');

          case 3:
            files = _context10.sent;
            expect(mockReadDir).toHaveBeenCalledTimes(1);
            expect(files).toEqual(['file']);

          case 6:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  })));
  test('writeFile', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _["default"].writeFile('location', {});

          case 2:
            expect(mockMkdir).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledTimes(1);

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  })));
  test('readFile', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var content;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _["default"].readFile('file');

          case 2:
            content = _context12.sent;
            expect(mockReadFile).toHaveBeenCalledTimes(1);
            expect(content).toBe('readFile');
            mockReadFile.mockImplementation(function () {
              return '{"test": "test"}';
            });
            _context12.next = 8;
            return _["default"].readFile('file', 'json');

          case 8:
            content = _context12.sent;
            expect(mockReadFile).toHaveBeenCalledTimes(2);
            expect(content).toEqual({
              test: 'test'
            });

          case 11:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
  test('copyFile', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _["default"].copyFile('1', '2');

          case 2:
            expect(mockCopyFile).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  })));
  test('convert', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            // Normal
            mockToThree.mockImplementation(function () {
              return {
                code: 0
              };
            });
            _context14.next = 3;
            return _["default"].convert('location', {
              name: 'name'
            }, function () {});

          case 3:
            expect(mockWriteFile).toHaveBeenCalledTimes(1); // Result

            mockToThree.mockImplementation(function () {
              return {
                code: 0,
                data: JSON.stringify({
                  path: 'test'
                })
              };
            });
            _context14.next = 7;
            return _["default"].convert('location', {
              name: 'name'
            }, function () {}, {
              isResult: true
            });

          case 7:
            expect(mockWriteFile).toHaveBeenCalledTimes(2); // Error

            _context14.prev = 8;
            mockToThree.mockImplementation(function () {
              return {
                code: 0,
                error: 'error'
              };
            });
            _context14.next = 12;
            return _["default"].convert('location', {
              name: 'name'
            }, function () {});

          case 12:
            expect(true).toBe(false);
            _context14.next = 19;
            break;

          case 15:
            _context14.prev = 15;
            _context14.t0 = _context14["catch"](8);
            expect(_context14.t0.message).toBe('Conversion process failed. Error: error');
            expect(true).toBe(true);

          case 19:
            _context14.prev = 19;
            mockToThree.mockImplementation(function () {
              return {
                code: -1
              };
            });
            _context14.next = 23;
            return _["default"].convert('location', {
              name: 'name'
            });

          case 23:
            expect(true).toBe(false);
            _context14.next = 29;
            break;

          case 26:
            _context14.prev = 26;
            _context14.t1 = _context14["catch"](19);
            expect(true).toBe(true);

          case 29:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[8, 15], [19, 26]]);
  })));
  test('loadPart', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
    var part;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            // Full
            JSON.parse = function () {
              return {
                solids: [{}],
                faces: [{}],
                edges: [{}]
              };
            };

            _context15.next = 3;
            return _["default"].loadPart('target', 'file');

          case 3:
            part = _context15.sent;
            expect(part).toEqual({
              solids: [{
                buffer: 'readFile'
              }],
              faces: [{
                buffer: 'readFile'
              }],
              edges: [{
                buffer: 'readFile'
              }]
            });
            expect(mockReadFile).toHaveBeenCalledTimes(4); // Empty

            JSON.parse = function () {
              return {};
            };

            _context15.next = 9;
            return _["default"].loadPart('target', 'file');

          case 9:
            part = _context15.sent;
            expect(part).toEqual({});
            expect(mockReadFile).toHaveBeenCalledTimes(4 + 1);

          case 12:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  })));
  test('removeFile', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return _["default"].removeFile('file');

          case 2:
            expect(mockUnlink).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  })));
  test('removeDirectory', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return _["default"].removeDirectory('directory');

          case 2:
            expect(mockRmdir).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  })));
});