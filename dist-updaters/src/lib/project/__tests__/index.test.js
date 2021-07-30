"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require("../"));

var mockAdd = jest.fn();
var mockGet = jest.fn();
var mockUpdate = jest.fn();
var mockDelete = jest.fn();
jest.mock("../../../database/project", function () {
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
var mockAvatar = jest.fn();
jest.mock("../../avatar", function () {
  return {
    read: function () {
      var _read = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(val) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockAvatar(val));

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function read(_x) {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  };
});
var mockGetUser = jest.fn();
jest.mock("../../user", function () {
  return {
    get: function () {
      var _get2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(val) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", mockGetUser(val));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function get(_x2) {
        return _get2.apply(this, arguments);
      }

      return get;
    }()
  };
});
var mockGetGroup = jest.fn();
var mockUpdateGroup = jest.fn();
jest.mock("../../group", function () {
  return {
    get: function () {
      var _get3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockGetGroup());

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function get() {
        return _get3.apply(this, arguments);
      }

      return get;
    }(),
    update: function () {
      var _update2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockUpdateGroup());

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function update() {
        return _update2.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockUpdateWorkspace = jest.fn();
jest.mock("../../workspace", function () {
  return {
    update: function () {
      var _update3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", mockUpdateWorkspace());

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function update() {
        return _update3.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockDelSimulation = jest.fn();
jest.mock("../../simulation", function () {
  return {
    del: function () {
      var _del2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", mockDelSimulation());

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function del() {
        return _del2.apply(this, arguments);
      }

      return del;
    }()
  };
});
describe('lib/project', function () {
  beforeEach(function () {
    mockAdd.mockReset();
    mockGet.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
    mockAvatar.mockReset();
    mockGetUser.mockReset();
    mockGetGroup.mockReset();
    mockUpdateGroup.mockReset();
    mockUpdateWorkspace.mockReset();
    mockDelSimulation.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var project;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            mockAdd.mockImplementation(function () {
              return {
                id: 'id'
              };
            });
            _context11.next = 3;
            return _["default"].add({}, {
              workspace: {},
              project: {}
            });

          case 3:
            project = _context11.sent;
            expect(mockAdd).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockAvatar).toHaveBeenCalledTimes(0);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateWorkspace).toHaveBeenCalledTimes(1);
            expect(mockDelSimulation).toHaveBeenCalledTimes(0);
            expect(project).toEqual({
              id: 'id'
            });

          case 13:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  })));
  test('get', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var project;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            // Empty
            mockGet.mockImplementation(function () {
              return {};
            });
            _context12.next = 3;
            return _["default"].get();

          case 3:
            project = _context12.sent;
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockAvatar).toHaveBeenCalledTimes(0);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0);
            expect(mockDelSimulation).toHaveBeenCalledTimes(0);
            expect(project).toEqual({}); // With avatar, owners, users & groups

            mockGet.mockImplementation(function () {
              return {
                avatar: 'avatar',
                owners: ['owner'],
                users: ['user'],
                groups: ['group']
              };
            });
            mockAvatar.mockImplementation(function (val) {
              return val;
            });
            _context12.next = 17;
            return _["default"].get();

          case 17:
            project = _context12.sent;
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockAvatar).toHaveBeenCalledTimes(1);
            expect(mockGetUser).toHaveBeenCalledTimes(2);
            expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0);
            expect(mockDelSimulation).toHaveBeenCalledTimes(0);
            expect(project).toEqual({
              avatar: 'avatar',
              owners: [{
                id: 'owner'
              }],
              users: [{
                id: 'user'
              }],
              groups: [{
                id: 'group'
              }]
            }); // With avatar error

            mockAvatar.mockImplementation(function () {
              throw new Error();
            });
            _context12.next = 30;
            return _["default"].get();

          case 30:
            project = _context12.sent;
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(3);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockAvatar).toHaveBeenCalledTimes(2);
            expect(mockGetUser).toHaveBeenCalledTimes(4);
            expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0);
            expect(mockDelSimulation).toHaveBeenCalledTimes(0);
            expect(project).toEqual({
              avatar: undefined,
              owners: [{
                id: 'owner'
              }],
              users: [{
                id: 'user'
              }],
              groups: [{
                id: 'group'
              }]
            });

          case 40:
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
            mockGet.mockImplementation(function () {
              return {};
            });
            _context13.next = 3;
            return _["default"].update({}, []);

          case 3:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockAvatar).toHaveBeenCalledTimes(0);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0);
            expect(mockDelSimulation).toHaveBeenCalledTimes(0); // With groups

            mockGet.mockImplementation(function () {
              return {
                groups: ['id1']
              };
            });
            _context13.next = 14;
            return _["default"].update({}, [{
              key: 'groups',
              value: ['id']
            }]);

          case 14:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(2);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockAvatar).toHaveBeenCalledTimes(0);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0);
            expect(mockDelSimulation).toHaveBeenCalledTimes(0);

          case 22:
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
            // Without simulations & groups
            mockGet.mockImplementation(function () {
              return {};
            });
            _context14.next = 3;
            return _["default"].del({}, {});

          case 3:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(1);
            expect(mockAvatar).toHaveBeenCalledTimes(0);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateWorkspace).toHaveBeenCalledTimes(1);
            expect(mockDelSimulation).toHaveBeenCalledTimes(0); // With simulations & groups

            mockGet.mockImplementation(function () {
              return {
                groups: ['id'],
                simulations: ['id']
              };
            });
            _context14.next = 14;
            return _["default"].del({}, {});

          case 14:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(2);
            expect(mockAvatar).toHaveBeenCalledTimes(0);
            expect(mockGetUser).toHaveBeenCalledTimes(0);
            expect(mockUpdateWorkspace).toHaveBeenCalledTimes(2);
            expect(mockDelSimulation).toHaveBeenCalledTimes(1);

          case 22:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  })));
});