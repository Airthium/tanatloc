"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require("../"));

var mockGet = jest.fn();
var mockGetAll = jest.fn();
var mockGetByUsernameAndPassword = jest.fn();
var mockUpdate = jest.fn();
var mockDel = jest.fn();
jest.mock("../../../database/user", function () {
  return {
    add: function () {
      var _add = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", {
                  id: 'id'
                });

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
    getAll: function () {
      var _getAll = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", mockGetAll());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getAll() {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }(),
    getByUsernameAndPassword: function () {
      var _getByUsernameAndPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockGetByUsernameAndPassword());

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function getByUsernameAndPassword() {
        return _getByUsernameAndPassword.apply(this, arguments);
      }

      return getByUsernameAndPassword;
    }(),
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockUpdate());

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
    }(),
    del: function () {
      var _del = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", mockDel());

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function del() {
        return _del.apply(this, arguments);
      }

      return del;
    }()
  };
});
var mockReadAvatar = jest.fn();
var mockDelAvatar = jest.fn();
jest.mock("../../avatar", function () {
  return {
    read: function () {
      var _read = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockReadAvatar());

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function read() {
        return _read.apply(this, arguments);
      }

      return read;
    }(),
    del: function () {
      var _del2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockDelAvatar());

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function del() {
        return _del2.apply(this, arguments);
      }

      return del;
    }()
  };
});
var mockDelWorkspace = jest.fn();
jest.mock("../../workspace", function () {
  return {
    del: function () {
      var _del3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", mockDelWorkspace());

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function del() {
        return _del3.apply(this, arguments);
      }

      return del;
    }()
  };
});
var mockUpdateGroup = jest.fn();
jest.mock("../../group", function () {
  return {
    update: function () {
      var _update2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", mockUpdateGroup());

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function update() {
        return _update2.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockEmailSubscribe = jest.fn();
jest.mock("../../email", function () {
  return {
    subscribe: function () {
      var _subscribe = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", mockEmailSubscribe());

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function subscribe() {
        return _subscribe.apply(this, arguments);
      }

      return subscribe;
    }()
  };
});
describe('lib/user', function () {
  beforeEach(function () {
    mockGet.mockReset();
    mockGetAll.mockReset();
    mockGetByUsernameAndPassword.mockReset();
    mockUpdate.mockReset();
    mockDel.mockReset();
    mockReadAvatar.mockReset();
    mockDelAvatar.mockReset();
    mockDelWorkspace.mockReset();
    mockUpdateGroup.mockReset();
    mockEmailSubscribe.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var user;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _["default"].add({
              email: 'email',
              password: 'password'
            });

          case 2:
            user = _context12.sent;
            expect(mockEmailSubscribe).toHaveBeenCalledTimes(1);
            expect(user).toEqual({
              id: 'id'
            });

          case 5:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
  test('get', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    var user;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            // Normal
            mockGet.mockImplementation(function () {
              return {
                id: 'id',
                email: 'email'
              };
            });
            _context13.next = 3;
            return _["default"].get('id', []);

          case 3:
            user = _context13.sent;
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDel).toHaveBeenCalledTimes(0);
            expect(mockReadAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelWorkspace).toHaveBeenCalledTimes(0);
            expect(user).toEqual({
              id: 'id',
              email: 'email'
            }); // With avatar

            mockGet.mockImplementation(function () {
              return {
                id: 'id',
                email: 'email',
                avatar: 'avatar'
              };
            });
            mockReadAvatar.mockImplementation(function () {
              return 'avatar';
            });
            _context13.next = 16;
            return _["default"].get('id');

          case 16:
            user = _context13.sent;
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDel).toHaveBeenCalledTimes(0);
            expect(mockReadAvatar).toHaveBeenCalledTimes(1);
            expect(mockDelAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelWorkspace).toHaveBeenCalledTimes(0);
            expect(user).toEqual({
              id: 'id',
              email: 'email',
              avatar: 'avatar'
            });
            mockReadAvatar.mockImplementation(function () {
              throw new Error('test');
            });
            _context13.next = 28;
            return _["default"].get('id');

          case 28:
            user = _context13.sent;
            expect(mockGet).toHaveBeenCalledTimes(3);
            expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDel).toHaveBeenCalledTimes(0);
            expect(mockReadAvatar).toHaveBeenCalledTimes(2);
            expect(mockDelAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelWorkspace).toHaveBeenCalledTimes(0);
            expect(user).toEqual({
              id: 'id',
              email: 'email',
              avatar: undefined
            });

          case 37:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  })));
  test('getBy', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    var user;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {
                id: 'id'
              };
            });
            _context14.next = 3;
            return _["default"].getBy('email', ['id'], 'email');

          case 3:
            user = _context14.sent;
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(user).toEqual({
              id: 'id'
            });

          case 6:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  })));
  test('getAll', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
    var users;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            mockGetAll.mockImplementation(function () {
              return [{
                id: 'id'
              }];
            });
            _context15.next = 3;
            return _["default"].getAll();

          case 3:
            users = _context15.sent;
            expect(mockGetAll).toHaveBeenCalledTimes(1);
            expect(users).toEqual([{
              id: 'id'
            }]);

          case 6:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  })));
  test('login', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    var user;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return _["default"].login({
              email: 'email'
            });

          case 2:
            user = _context16.sent;
            expect(mockGet).toHaveBeenCalledTimes(0);
            expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDel).toHaveBeenCalledTimes(0);
            expect(mockReadAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelWorkspace).toHaveBeenCalledTimes(0);
            expect(user).toBe(null); // Logged

            mockGetByUsernameAndPassword.mockImplementation(function () {
              return {
                id: 'id',
                email: 'email'
              };
            });
            _context16.next = 14;
            return _["default"].login({
              email: 'email'
            });

          case 14:
            user = _context16.sent;
            expect(mockGet).toHaveBeenCalledTimes(0);
            expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDel).toHaveBeenCalledTimes(0);
            expect(mockReadAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelWorkspace).toHaveBeenCalledTimes(0);
            expect(user).toEqual({
              id: 'id',
              email: 'email'
            });

          case 23:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  })));
  test('update', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return _["default"].update({}, []);

          case 2:
            expect(mockGet).toHaveBeenCalledTimes(0);
            expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockDel).toHaveBeenCalledTimes(0);
            expect(mockReadAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelWorkspace).toHaveBeenCalledTimes(0);

          case 8:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  })));
  test('del', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            // Without workspaces & groups
            mockGet.mockImplementation(function () {
              return {};
            });
            _context18.next = 3;
            return _["default"].del({});

          case 3:
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDel).toHaveBeenCalledTimes(1);
            expect(mockReadAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelWorkspace).toHaveBeenCalledTimes(0); // With workspaces, groups & avatar

            mockGet.mockImplementation(function () {
              return {
                groups: ['id'],
                workspaces: ['id'],
                avatar: 'id'
              };
            });
            _context18.next = 13;
            return _["default"].del({});

          case 13:
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDel).toHaveBeenCalledTimes(2);
            expect(mockReadAvatar).toHaveBeenCalledTimes(0);
            expect(mockDelAvatar).toHaveBeenCalledTimes(1);
            expect(mockDelWorkspace).toHaveBeenCalledTimes(1);
            expect(mockUpdateGroup).toHaveBeenCalledTimes(1);

          case 21:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  })));
});