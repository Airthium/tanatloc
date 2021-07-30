"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require(".."));

var mockAdd = jest.fn();
var mockGet = jest.fn();
var mockGetAll = jest.fn();
var mockUpdate = jest.fn();
var mockDel = jest.fn();
jest.mock("../../../database/organization", function () {
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
    update: function update(async) {
      return mockUpdate();
    },
    del: function () {
      var _del = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockDel());

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
var mockUserAdd = jest.fn();
var mockUserGet = jest.fn();
var mockUserGetBy = jest.fn();
var mockUserUpdate = jest.fn();
jest.mock("../../user", function () {
  return {
    add: function () {
      var _add2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockUserAdd());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function add() {
        return _add2.apply(this, arguments);
      }

      return add;
    }(),
    get: function () {
      var _get2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", mockUserGet());

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function get() {
        return _get2.apply(this, arguments);
      }

      return get;
    }(),
    getBy: function () {
      var _getBy = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockUserGetBy());

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function getBy() {
        return _getBy.apply(this, arguments);
      }

      return getBy;
    }(),
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockUserUpdate());

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockGroupGet = jest.fn();
var mockGroupDel = jest.fn();
jest.mock("../../group", function () {
  return {
    get: function () {
      var _get3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", mockGroupGet());

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function get() {
        return _get3.apply(this, arguments);
      }

      return get;
    }(),
    del: function () {
      var _del2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", mockGroupDel());

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
describe('lib/organization', function () {
  beforeEach(function () {
    mockAdd.mockReset();
    mockGet.mockReset();
    mockGetAll.mockReset();
    mockUpdate.mockReset();
    mockDel.mockReset();
    mockUserAdd.mockReset();
    mockUserGet.mockReset();
    mockUserGetBy.mockReset();
    mockUserUpdate.mockReset();
    mockGroupGet.mockReset();
    mockGroupDel.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var organization;
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
            return _["default"].add({}, {});

          case 3:
            organization = _context11.sent;
            expect(mockAdd).toHaveBeenCalledTimes(1);
            expect(mockUserUpdate).toHaveBeenCalledTimes(1);
            expect(organization).toEqual({
              id: 'id'
            });

          case 7:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  })));
  test('get', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var organization;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {
                name: 'name'
              };
            });
            _context12.next = 3;
            return _["default"].get('id', ['data']);

          case 3:
            organization = _context12.sent;
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(organization).toEqual({
              name: 'name'
            });

          case 6:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
  test('getByUsers', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    var organizations;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            // Minimal
            mockGetAll.mockImplementation(function () {
              return [{
                name: 'name',
                owners: ['id1'],
                users: ['id2']
              }];
            });
            _context13.next = 3;
            return _["default"].getByUser({
              id: 'id1'
            }, ['name']);

          case 3:
            organizations = _context13.sent;
            expect(mockGetAll).toHaveBeenCalledTimes(1);
            expect(organizations).toEqual([{
              name: 'name'
            }]); // With owners, users & groups

            mockGetAll.mockImplementation(function () {
              return [{
                name: 'name',
                owners: ['id1'],
                users: ['id2'],
                groups: ['id3']
              }];
            });
            mockUserGet.mockImplementation(function () {
              return {
                firstname: 'firstname'
              };
            });
            mockGroupGet.mockImplementation(function () {
              return {
                name: 'name'
              };
            });
            _context13.next = 11;
            return _["default"].getByUser({
              id: 'id2'
            }, ['name', 'owners', 'users', 'groups']);

          case 11:
            organizations = _context13.sent;
            expect(mockGetAll).toHaveBeenCalledTimes(2);
            expect(mockUserGet).toHaveBeenCalledTimes(2);
            expect(mockGroupGet).toHaveBeenCalledTimes(1);
            expect(organizations).toEqual([{
              name: 'name',
              owners: [{
                id: 'id1',
                firstname: 'firstname'
              }],
              users: [{
                id: 'id2',
                firstname: 'firstname'
              }],
              groups: [{
                id: 'id3',
                name: 'name'
              }]
            }]);

          case 16:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  })));
  test('update', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return _["default"].update({}, [{
              key: 'test'
            }]);

          case 2:
            expect(mockUpdate).toHaveBeenCalledTimes(1); // With existing users

            mockUserGetBy.mockImplementation(function () {
              return {};
            });
            _context14.next = 6;
            return _["default"].update({}, [{
              key: 'owners',
              type: 'array',
              method: 'append',
              value: 'email'
            }, {
              key: 'users',
              type: 'array',
              method: 'append',
              value: 'email'
            }]);

          case 6:
            expect(mockUpdate).toHaveBeenCalledTimes(2);
            expect(mockUserUpdate).toHaveBeenCalledTimes(2); // With non-existing users

            mockUserAdd.mockImplementation(function () {
              return {};
            });
            mockUserGetBy.mockImplementation(function () {});
            _context14.next = 12;
            return _["default"].update({}, [{
              key: 'owners',
              type: 'array',
              method: 'append',
              value: 'email'
            }, {
              key: 'users',
              type: 'array',
              method: 'append',
              value: 'email'
            }]);

          case 12:
            expect(mockUpdate).toHaveBeenCalledTimes(3);
            expect(mockUserAdd).toHaveBeenCalledTimes(2);
            expect(mockUserUpdate).toHaveBeenCalledTimes(4);

          case 15:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  })));
  test('del', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            // Minimal
            mockGet.mockImplementation(function () {
              return {
                name: 'name'
              };
            });
            _context15.next = 3;
            return _["default"].del({});

          case 3:
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockDel).toHaveBeenCalledTimes(1); // With owners, users & groups

            mockGet.mockImplementation(function () {
              return {
                name: 'name',
                owners: ['id'],
                users: ['id'],
                groups: ['id']
              };
            });
            _context15.next = 8;
            return _["default"].del({});

          case 8:
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUserUpdate).toHaveBeenCalledTimes(2);
            expect(mockGroupDel).toHaveBeenCalledTimes(1);
            expect(mockDel).toHaveBeenCalledTimes(2);

          case 12:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  })));
});