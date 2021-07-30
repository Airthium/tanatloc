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
jest.mock("../../../../config/storage", function () {
  return {
    AVATAR: 'avatar'
  };
});
var mockAdd = jest.fn();
var mockGet = jest.fn();
var mockDel = jest.fn();
jest.mock("../../../database/avatar", function () {
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
    del: function () {
      var _del = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", mockDel());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function del() {
        return _del.apply(this, arguments);
      }

      return del;
    }()
  };
});
var mockGetUser = jest.fn();
var mockUpdateUser = jest.fn();
jest.mock("../../user", function () {
  return {
    get: function () {
      var _get2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockGetUser());

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function get() {
        return _get2.apply(this, arguments);
      }

      return get;
    }(),
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockUpdateUser());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockGetProject = jest.fn();
var mockUpdateProject = jest.fn();
jest.mock("../../project", function () {
  return {
    get: function () {
      var _get3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", mockGetProject());

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function get() {
        return _get3.apply(this, arguments);
      }

      return get;
    }(),
    update: function () {
      var _update2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockUpdateProject());

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
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
var mockRemoveFile = jest.fn();
jest.mock("../../tools", function () {
  return {
    readFile: function () {
      var _readFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockReadFile());

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function readFile() {
        return _readFile.apply(this, arguments);
      }

      return readFile;
    }(),
    writeFile: function () {
      var _writeFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", mockWriteFile());

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function writeFile() {
        return _writeFile.apply(this, arguments);
      }

      return writeFile;
    }(),
    removeFile: function () {
      var _removeFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", mockRemoveFile());

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function removeFile() {
        return _removeFile.apply(this, arguments);
      }

      return removeFile;
    }()
  };
});
describe('lib/avatar', function () {
  beforeEach(function () {
    mockPath.mockReset();
    mockAdd.mockReset();
    mockAdd.mockImplementation(function () {
      return {
        id: 'id'
      };
    });
    mockGet.mockReset();
    mockGet.mockImplementation(function () {
      return {
        path: 'path'
      };
    });
    mockDel.mockReset();
    mockGetUser.mockReset();
    mockGetUser.mockImplementation(function () {
      return {};
    });
    mockUpdateUser.mockReset();
    mockGetProject.mockReset();
    mockGetProject.mockImplementation(function () {
      return {};
    });
    mockUpdateProject.mockReset();
    mockReadFile.mockReset();
    mockReadFile.mockImplementation(function () {
      return 'avatar';
    });
    mockWriteFile.mockReset();
    mockRemoveFile.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var avatar;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _["default"].add({
              id: 'id'
            }, 'user', {
              name: 'name',
              uid: 'uid',
              data: 'data'
            });

          case 2:
            avatar = _context11.sent;
            expect(mockPath).toHaveBeenCalledTimes(0);
            expect(mockAdd).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledTimes(0);
            expect(mockDel).toHaveBeenCalledTimes(0);
            expect(mockGetUser).toHaveBeenCalledTimes(1);
            expect(mockUpdateUser).toHaveBeenCalledTimes(1);
            expect(mockGetProject).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockReadFile).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(avatar).toEqual({
              id: 'id'
            }); // With user avatar

            mockGetUser.mockImplementation(function () {
              return {
                avatar: 'avatar'
              };
            });
            _context11.next = 18;
            return _["default"].add({
              id: 'id'
            }, 'user', {
              name: 'name',
              uid: 'uid',
              data: 'data'
            });

          case 18:
            avatar = _context11.sent;
            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(mockAdd).toHaveBeenCalledTimes(2);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockDel).toHaveBeenCalledTimes(1);
            expect(mockGetUser).toHaveBeenCalledTimes(2);
            expect(mockUpdateUser).toHaveBeenCalledTimes(3);
            expect(mockGetProject).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockReadFile).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(2);
            expect(mockRemoveFile).toHaveBeenCalledTimes(1);
            expect(avatar).toEqual({
              id: 'id'
            }); // Project

            _context11.next = 33;
            return _["default"].add({
              id: 'id'
            }, 'project', {
              name: 'name',
              uid: 'uid',
              data: 'data'
            });

          case 33:
            avatar = _context11.sent;
            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(mockAdd).toHaveBeenCalledTimes(3);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockDel).toHaveBeenCalledTimes(1);
            expect(mockGetUser).toHaveBeenCalledTimes(2);
            expect(mockUpdateUser).toHaveBeenCalledTimes(3);
            expect(mockGetProject).toHaveBeenCalledTimes(1);
            expect(mockUpdateProject).toHaveBeenCalledTimes(1);
            expect(mockReadFile).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(3);
            expect(mockRemoveFile).toHaveBeenCalledTimes(1);
            expect(avatar).toEqual({
              id: 'id'
            }); // With project avatar

            mockGetProject.mockImplementation(function () {
              return {
                avatar: 'avatar'
              };
            });
            _context11.next = 49;
            return _["default"].add({
              id: 'id'
            }, 'project', {
              name: 'name',
              uid: 'uid',
              data: 'data'
            });

          case 49:
            avatar = _context11.sent;
            expect(mockPath).toHaveBeenCalledTimes(2);
            expect(mockAdd).toHaveBeenCalledTimes(4);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockDel).toHaveBeenCalledTimes(2);
            expect(mockGetUser).toHaveBeenCalledTimes(2);
            expect(mockUpdateUser).toHaveBeenCalledTimes(3);
            expect(mockGetProject).toHaveBeenCalledTimes(2);
            expect(mockUpdateProject).toHaveBeenCalledTimes(3);
            expect(mockReadFile).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(4);
            expect(mockRemoveFile).toHaveBeenCalledTimes(2);
            expect(avatar).toEqual({
              id: 'id'
            });

          case 62:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  })));
  test('read', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var avatar;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _["default"].read('id');

          case 2:
            avatar = _context12.sent;
            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockDel).toHaveBeenCalledTimes(0);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateUser).toHaveBeenCalledTimes(0);
            expect(mockGetProject).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockReadFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(avatar).toBe('avatar');

          case 15:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
  test('get', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    var avatar;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _["default"].get('id', ['data']);

          case 2:
            avatar = _context13.sent;
            expect(mockPath).toHaveBeenCalledTimes(0);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockDel).toHaveBeenCalledTimes(0);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateUser).toHaveBeenCalledTimes(0);
            expect(mockGetProject).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockReadFile).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(avatar).toEqual({
              path: 'path'
            });

          case 15:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  })));
  test('del', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return _["default"].del({
              id: 'id'
            }, 'user', 'id');

          case 2:
            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockDel).toHaveBeenCalledTimes(1);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateUser).toHaveBeenCalledTimes(1);
            expect(mockGetProject).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockReadFile).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(1); // removeFile error & project

            mockRemoveFile.mockImplementation(function () {
              throw new Error();
            });
            _context14.next = 16;
            return _["default"].del({
              id: 'id'
            }, 'project', 'id');

          case 16:
            expect(mockPath).toHaveBeenCalledTimes(2);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockDel).toHaveBeenCalledTimes(2);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateUser).toHaveBeenCalledTimes(1);
            expect(mockGetProject).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(1);
            expect(mockReadFile).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(2); // Without path

            mockGet.mockImplementation(function () {
              return {};
            });
            _context14.next = 30;
            return _["default"].del({
              id: 'id'
            }, 'user', 'id');

          case 30:
            expect(mockPath).toHaveBeenCalledTimes(2);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(3);
            expect(mockDel).toHaveBeenCalledTimes(3);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateUser).toHaveBeenCalledTimes(2);
            expect(mockGetProject).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(1);
            expect(mockReadFile).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(2);

          case 41:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  })));
});