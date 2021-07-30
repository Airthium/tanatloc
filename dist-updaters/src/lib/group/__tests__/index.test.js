"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require("../"));

var mockAdd = jest.fn();
var mockGet = jest.fn();
var mockGetAll = jest.fn();
var mockUpdate = jest.fn();
var mockDel = jest.fn();
jest.mock("../../../database/group", function () {
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
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockUpdate());

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }(),
    del: function () {
      var _del = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockDel());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function del() {
        return _del.apply(this, arguments);
      }

      return del;
    }()
  };
});
var mockUserGet = jest.fn();
var mockUserUpdate = jest.fn();
jest.mock("../../user", function () {
  return {
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
    update: function () {
      var _update2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockUserUpdate());

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
var mockWorkspaceUpdate = jest.fn();
jest.mock("../../workspace", function () {
  return {
    update: function () {
      var _update3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockWorkspaceUpdate());

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function update() {
        return _update3.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockProjectUpdate = jest.fn();
jest.mock("../../project", function () {
  return {
    update: function () {
      var _update4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", mockProjectUpdate());

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function update() {
        return _update4.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockOrganizationGet = jest.fn();
var mockOrganizationUpdate = jest.fn();
jest.mock("../../organization", function () {
  return {
    get: function () {
      var _get3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", mockOrganizationGet());

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function get() {
        return _get3.apply(this, arguments);
      }

      return get;
    }(),
    update: function () {
      var _update5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", mockOrganizationUpdate());

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function update() {
        return _update5.apply(this, arguments);
      }

      return update;
    }()
  };
});
describe('lib/group', function () {
  beforeEach(function () {
    mockAdd.mockReset();
    mockGet.mockReset();
    mockGetAll.mockReset();
    mockUpdate.mockReset();
    mockDel.mockReset();
    mockUserGet.mockReset();
    mockUserUpdate.mockReset();
    mockWorkspaceUpdate.mockReset();
    mockProjectUpdate.mockReset();
    mockOrganizationGet.mockReset();
    mockOrganizationUpdate.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var group;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            mockAdd.mockImplementation(function () {
              return {
                id: 'id'
              };
            });
            _context12.next = 3;
            return _["default"].add({}, {
              name: 'group',
              users: ['id']
            });

          case 3:
            group = _context12.sent;
            expect(group).toEqual({
              id: 'id'
            });
            expect(mockAdd).toHaveBeenCalledTimes(1);
            expect(mockOrganizationUpdate).toHaveBeenCalledTimes(1);

          case 7:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
  test('get', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    var group;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {
                id: 'id',
                users: ['id']
              };
            });
            mockUserGet.mockImplementation(function () {
              return {
                firstname: 'firstname'
              };
            });
            _context13.next = 4;
            return _["default"].get('id', ['data']);

          case 4:
            group = _context13.sent;
            expect(group).toEqual({
              id: 'id',
              users: [{
                id: 'id',
                firstname: 'firstname'
              }]
            });
            expect(mockGet).toHaveBeenCalledTimes(1);

          case 7:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  })));
  test('getAll', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    var groups;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            // Minimal
            mockGetAll.mockImplementation(function () {
              return [{
                name: 'name'
              }];
            });
            _context14.next = 3;
            return _["default"].getAll(['data']);

          case 3:
            groups = _context14.sent;
            expect(mockGetAll).toHaveBeenCalledTimes(1);
            expect(groups).toEqual([{
              name: 'name'
            }]); // With users

            mockGetAll.mockImplementation(function () {
              return [{
                name: 'name',
                users: ['id']
              }];
            });
            mockUserGet.mockImplementation(function () {
              return {
                firstname: 'firstname'
              };
            });
            _context14.next = 10;
            return _["default"].getAll(['data']);

          case 10:
            groups = _context14.sent;
            expect(mockGetAll).toHaveBeenCalledTimes(2);
            expect(mockUserGet).toHaveBeenCalledTimes(1);
            expect(groups).toEqual([{
              name: 'name',
              users: [{
                id: 'id',
                firstname: 'firstname'
              }]
            }]);

          case 14:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  })));
  test('getByOrganization', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
    var groups;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            // Minimal
            mockOrganizationGet.mockImplementation(function () {
              return {
                groups: ['id']
              };
            });
            mockGet.mockImplementation(function () {
              return {
                name: 'name'
              };
            });
            _context15.next = 4;
            return _["default"].getByOrganization('id', ['data']);

          case 4:
            groups = _context15.sent;
            expect(mockOrganizationGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(groups).toEqual([{
              id: 'id',
              name: 'name'
            }]); // With users

            mockGet.mockImplementation(function () {
              return {
                name: 'name',
                users: ['id']
              };
            });
            mockUserGet.mockImplementation(function () {
              return {
                firstname: 'firstname'
              };
            });
            _context15.next = 12;
            return _["default"].getByOrganization('id', ['data']);

          case 12:
            groups = _context15.sent;
            expect(mockOrganizationGet).toHaveBeenCalledTimes(2);
            expect(mockUserGet).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(groups).toEqual([{
              id: 'id',
              name: 'name',
              users: [{
                id: 'id',
                firstname: 'firstname'
              }]
            }]);

          case 17:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  })));
  test('update', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return _["default"].update({}, [{}]);

          case 2:
            expect(mockUpdate).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  })));
  test('del', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            // Minimal
            mockGet.mockImplementation(function () {
              return {};
            });
            _context17.next = 3;
            return _["default"].del({});

          case 3:
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockOrganizationUpdate).toHaveBeenCalledTimes(1);
            expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(0);
            expect(mockProjectUpdate).toHaveBeenCalledTimes(0);
            expect(mockDel).toHaveBeenCalledTimes(1); // With workspaces & projects

            mockGet.mockImplementation(function () {
              return {
                users: ['id'],
                workspaces: ['id'],
                projects: ['id']
              };
            });
            _context17.next = 11;
            return _["default"].del({});

          case 11:
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockOrganizationUpdate).toHaveBeenCalledTimes(2);
            expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1);
            expect(mockProjectUpdate).toHaveBeenCalledTimes(1);
            expect(mockDel).toHaveBeenCalledTimes(2);

          case 16:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  })));
});