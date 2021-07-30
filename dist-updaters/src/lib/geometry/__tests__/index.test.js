"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _2 = _interopRequireDefault(require("../"));

var mockPath = jest.fn();
jest.mock('path', function () {
  return {
    join: function join(_, path) {
      return mockPath(path);
    }
  };
});
jest.mock("../../../../config/storage", function () {
  return {};
});
var mockAdd = jest.fn();
var mockGet = jest.fn();
var mockUpdate = jest.fn();
var mockDelete = jest.fn();
jest.mock("../../../database/geometry", function () {
  return {
    add: function () {
      var _add = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", mockAdd());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function add() {
        return _add.apply(this, arguments);
      }

      return add;
    }(),
    get: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", mockGet());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function get() {
        return _get.apply(this, arguments);
      }

      return get;
    }(),
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", mockUpdate());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }(),
    del: function () {
      var _del = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockDelete());

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function del() {
        return _del.apply(this, arguments);
      }

      return del;
    }()
  };
});
var mockProjectUpdate = jest.fn();
jest.mock("../../project", function () {
  return {
    update: function () {
      var _update2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockProjectUpdate());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function update() {
        return _update2.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockReadFile = jest.fn();
var mockWriteFile = jest.fn();
var mockConvert = jest.fn();
var mockRemoveFile = jest.fn();
var mockRemoveDirectory = jest.fn();
jest.mock("../../tools", function () {
  return {
    readFile: function () {
      var _readFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(path) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", mockReadFile(path));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function readFile(_x) {
        return _readFile.apply(this, arguments);
      }

      return readFile;
    }(),
    writeFile: function () {
      var _writeFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockWriteFile());

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function writeFile() {
        return _writeFile.apply(this, arguments);
      }

      return writeFile;
    }(),
    convert: function () {
      var _convert = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockConvert());

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function convert() {
        return _convert.apply(this, arguments);
      }

      return convert;
    }(),
    removeFile: function () {
      var _removeFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", mockRemoveFile());

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function removeFile() {
        return _removeFile.apply(this, arguments);
      }

      return removeFile;
    }(),
    removeDirectory: function () {
      var _removeDirectory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", mockRemoveDirectory());

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function removeDirectory() {
        return _removeDirectory.apply(this, arguments);
      }

      return removeDirectory;
    }()
  };
});
describe('lib/simulation', function () {
  beforeEach(function () {
    mockPath.mockReset();
    mockAdd.mockReset();
    mockGet.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
    mockProjectUpdate.mockReset();
    mockReadFile.mockReset();
    mockWriteFile.mockReset();
    mockConvert.mockReset();
    mockRemoveFile.mockReset();
    mockRemoveDirectory.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var summary, count, geometry;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            mockAdd.mockImplementation(function () {
              return {
                id: 'id'
              };
            });
            mockConvert.mockImplementation(function () {
              return {
                json: 'json',
                glb: 'glb'
              };
            });
            summary = {
              solids: [{}, {}],
              faces: [{}, {}],
              edges: [{}, {}]
            };
            count = 0;
            mockReadFile.mockImplementation(function () {
              count++;
              if (count === 1) return summary;else {
                if (count % 2 === 0) return {};else return {
                  data: {
                    attributes: {
                      color: {
                        itemSize: 3,
                        array: [1, 1, 1]
                      }
                    }
                  }
                };
              }
            }); // Normal

            _context11.next = 7;
            return _2["default"].add({
              project: {
                id: 'id'
              },
              geometry: {
                name: 'name.step',
                uid: 'test',
                buffer: ['buffer']
              }
            });

          case 7:
            geometry = _context11.sent;
            expect(mockAdd).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockProjectUpdate).toHaveBeenCalledTimes(1);
            expect(mockConvert).toHaveBeenCalledTimes(1);
            expect(mockReadFile).toHaveBeenCalledTimes(7);
            expect(geometry).toEqual({
              id: 'id',
              json: 'json',
              glb: 'glb',
              summary: summary
            }); // Error

            mockGet.mockImplementation(function () {
              return {};
            });
            mockWriteFile.mockImplementation(function () {
              throw new Error();
            });
            _context11.prev = 16;
            _context11.next = 19;
            return _2["default"].add({
              project: {
                id: 'id'
              },
              geometry: {
                name: 'name.step',
                uid: 'test',
                buffer: ['buffer']
              }
            });

          case 19:
            _context11.next = 23;
            break;

          case 21:
            _context11.prev = 21;
            _context11.t0 = _context11["catch"](16);

          case 23:
            expect(mockAdd).toHaveBeenCalledTimes(2);
            expect(mockWriteFile).toHaveBeenCalledTimes(2);
            expect(mockProjectUpdate).toHaveBeenCalledTimes(2);
            expect(mockConvert).toHaveBeenCalledTimes(1);
            expect(mockReadFile).toHaveBeenCalledTimes(7);
            expect(mockGet).toHaveBeenCalledTimes(1);

          case 29:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[16, 21]]);
  })));
  test('get', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var geometry;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {};
            });
            _context12.next = 3;
            return _2["default"].get('id', []);

          case 3:
            geometry = _context12.sent;
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(geometry).toEqual({});

          case 6:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
  test('update', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _2["default"].update({}, []);

          case 2:
            expect(mockUpdate).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  })));
  test('delete', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {};
            });
            _context14.next = 3;
            return _2["default"].del({});

          case 3:
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockProjectUpdate).toHaveBeenCalledTimes(1);
            expect(mockDelete).toHaveBeenCalledTimes(1); // Remove files / directory

            mockGet.mockImplementation(function () {
              return {
                uploadfilename: 'uploadfilename',
                extension: 'extension',
                glb: 'glb',
                json: 'json'
              };
            });
            _context14.next = 9;
            return _2["default"].del({});

          case 9:
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockProjectUpdate).toHaveBeenCalledTimes(2);
            expect(mockPath).toHaveBeenCalledTimes(3);
            expect(mockRemoveFile).toHaveBeenCalledTimes(2);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(1);
            expect(mockDelete).toHaveBeenCalledTimes(2); // With errors

            mockRemoveFile.mockImplementation(function () {
              throw new Error();
            });
            mockRemoveDirectory.mockImplementation(function () {
              throw new Error();
            });
            _context14.next = 19;
            return _2["default"].del({});

          case 19:
            expect(mockGet).toHaveBeenCalledTimes(3);
            expect(mockProjectUpdate).toHaveBeenCalledTimes(3);
            expect(mockPath).toHaveBeenCalledTimes(6);
            expect(mockRemoveFile).toHaveBeenCalledTimes(4);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(2);
            expect(mockDelete).toHaveBeenCalledTimes(3);

          case 25:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  })));
  test('read', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
    var read;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {
                extension: 'extension',
                uploadfilename: 'uploadfilename'
              };
            });
            mockReadFile.mockImplementation(function () {
              return 'buffer';
            });
            _context15.next = 4;
            return _2["default"].read({
              id: 'id'
            });

          case 4:
            read = _context15.sent;
            expect(mockReadFile).toHaveBeenCalledTimes(1);
            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(read).toEqual({
              buffer: Buffer.from('buffer'),
              extension: 'extension'
            });

          case 8:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  })));
  test('readPart', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    var part;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            mockPath.mockImplementation(function (path) {
              return path;
            });
            mockGet.mockImplementation(function () {
              return {
                glb: 'glb',
                json: 'json'
              };
            });
            mockReadFile.mockImplementation(function (path) {
              if (path === 'glb') return 'buffer';else return {
                uuid: 'uuid'
              };
            });
            _context16.next = 5;
            return _2["default"].readPart({
              id: 'id'
            });

          case 5:
            part = _context16.sent;
            expect(mockReadFile).toHaveBeenCalledTimes(2);
            expect(mockPath).toHaveBeenCalledTimes(2);
            expect(part).toEqual({
              uuid: 'uuid',
              buffer: Buffer.from('buffer')
            });

          case 9:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  })));
});