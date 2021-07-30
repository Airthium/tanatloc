"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require("../"));

var mockAdd = jest.fn();
var mockGet = jest.fn();
var mockUpdate = jest.fn();
var mockDelete = jest.fn();
jest.mock("../../../database/workspace", function () {
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
var mockUserGet = jest.fn();
var mockUserUpdate = jest.fn();
jest.mock("../../user", function () {
  return {
    get: function () {
      var _get2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockUserGet());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function get() {
        return _get2.apply(this, arguments);
      }

      return get;
    }(),
    update: function () {
      var _update2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", mockUserUpdate());

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function update() {
        return _update2.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockGroupGet = jest.fn();
var mockGroupUpdate = jest.fn();
jest.mock("../../group", function () {
  return {
    get: function () {
      var _get3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockGroupGet());

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
      var _update3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockGroupUpdate());

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
var mockOrganizationGet = jest.fn();
jest.mock("../../organization", function () {
  return {
    get: function () {
      var _get4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", mockOrganizationGet());

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function get() {
        return _get4.apply(this, arguments);
      }

      return get;
    }()
  };
});
var mockDelProject = jest.fn();
jest.mock("../../project", function () {
  return {
    del: function () {
      var _del2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", mockDelProject());

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
describe('lib/workspace', function () {
  beforeEach(function () {
    mockAdd.mockReset();
    mockGet.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
    mockUserGet.mockReset();
    mockUserUpdate.mockReset();
    mockGroupGet.mockReset();
    mockGroupGet.mockReset();
    mockGroupUpdate.mockReset();
    mockOrganizationGet.mockReset();
    mockDelProject.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var workspace;
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
            workspace = _context11.sent;
            expect(mockAdd).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUserGet).toHaveBeenCalledTimes(0);
            expect(mockUserUpdate).toHaveBeenCalledTimes(1);
            expect(mockDelProject).toHaveBeenCalledTimes(0);
            expect(workspace).toEqual({
              id: 'id'
            });

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  })));
  test('get', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    var workspace;
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
            return _["default"].get();

          case 3:
            workspace = _context12.sent;
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUserGet).toHaveBeenCalledTimes(0);
            expect(mockUserUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelProject).toHaveBeenCalledTimes(0);
            expect(workspace).toEqual({
              name: 'name'
            }); // With owners and users

            mockGet.mockImplementation(function () {
              return {
                name: 'name',
                owners: ['id'],
                users: ['id'],
                groups: ['id']
              };
            });
            mockUserGet.mockImplementation(function () {
              return {
                email: 'email'
              };
            });
            mockGroupGet.mockImplementation(function () {
              return {
                name: 'name'
              };
            });
            _context12.next = 17;
            return _["default"].get();

          case 17:
            workspace = _context12.sent;
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUserGet).toHaveBeenCalledTimes(2);
            expect(mockUserUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelProject).toHaveBeenCalledTimes(0);
            expect(workspace).toEqual({
              name: 'name',
              owners: [{
                id: 'id',
                email: 'email'
              }],
              users: [{
                id: 'id',
                email: 'email'
              }],
              groups: [{
                id: 'id',
                name: 'name'
              }]
            });

          case 26:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
  test('getByUser', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    var workspaces;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            // With workspaces, organizations & groups
            mockUserGet.mockImplementation(function () {
              return {
                workspaces: ['id', 'id'],
                organizations: ['id']
              };
            });
            mockOrganizationGet.mockImplementation(function () {
              return {
                groups: ['id']
              };
            });
            mockGroupGet.mockImplementation(function () {
              return {
                name: 'name',
                workspaces: ['id'],
                projects: ['id']
              };
            });
            mockGet.mockImplementation(function () {
              return {
                name: 'name'
              };
            });
            _context13.next = 6;
            return _["default"].getByUser({});

          case 6:
            workspaces = _context13.sent;
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(3);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUserGet).toHaveBeenCalledTimes(1);
            expect(mockUserUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelProject).toHaveBeenCalledTimes(0);
            expect(workspaces).toEqual([{
              id: 'id',
              name: 'name'
            }, {
              id: 'id',
              name: 'name'
            }, {
              id: 'id',
              name: 'name',
              owners: []
            }, {
              id: '0',
              groups: [{
                id: 'id',
                name: 'name'
              }],
              name: 'Projects from name',
              owners: [],
              projects: ['id']
            }]); // With owners

            mockGet.mockImplementation(function () {
              return {
                name: 'name',
                owners: ['id']
              };
            });
            _context13.next = 18;
            return _["default"].getByUser({
              id: 'id'
            });

          case 18:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(6);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUserGet).toHaveBeenCalledTimes(5);
            expect(mockUserUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelProject).toHaveBeenCalledTimes(0); // Without group data

            mockGroupGet.mockImplementation(function () {
              return {};
            });
            _context13.next = 28;
            return _["default"].getByUser({});

          case 28:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(8);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUserGet).toHaveBeenCalledTimes(8);
            expect(mockUserUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelProject).toHaveBeenCalledTimes(0); // Without groups

            mockOrganizationGet.mockImplementation(function () {
              return {};
            });
            mockGroupGet.mockImplementation(function () {
              return {};
            });
            _context13.next = 39;
            return _["default"].getByUser({});

          case 39:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(10);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUserGet).toHaveBeenCalledTimes(11);
            expect(mockUserUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelProject).toHaveBeenCalledTimes(0); // Without workspaces & organizations

            mockUserGet.mockImplementation(function () {
              return {};
            });
            _context13.next = 49;
            return _["default"].getByUser({});

          case 49:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(10);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUserGet).toHaveBeenCalledTimes(12);
            expect(mockUserUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelProject).toHaveBeenCalledTimes(0);

          case 56:
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
            mockGet.mockImplementation(function () {
              return {};
            });
            _context14.next = 3;
            return _["default"].update({
              id: 'id'
            }, []);

          case 3:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUserGet).toHaveBeenCalledTimes(0);
            expect(mockUserUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelProject).toHaveBeenCalledTimes(0); // With groups

            mockGet.mockImplementation(function () {
              return {
                groups: ['id']
              };
            });
            _context14.next = 13;
            return _["default"].update({
              id: 'id'
            }, [{
              key: 'groups',
              value: ['id1']
            }]);

          case 13:
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
            // Without projects & groups
            mockGet.mockImplementation(function () {
              return {};
            });
            _context15.next = 3;
            return _["default"].del({}, {});

          case 3:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(1);
            expect(mockUserGet).toHaveBeenCalledTimes(0);
            expect(mockUserUpdate).toHaveBeenCalledTimes(1);
            expect(mockDelProject).toHaveBeenCalledTimes(0); // With projects & groups

            mockGet.mockImplementation(function () {
              return {
                projects: ['id'],
                groups: ['id']
              };
            });
            _context15.next = 13;
            return _["default"].del({}, {});

          case 13:
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(2);
            expect(mockUserGet).toHaveBeenCalledTimes(0);
            expect(mockUserUpdate).toHaveBeenCalledTimes(2);
            expect(mockDelProject).toHaveBeenCalledTimes(1);

          case 20:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  })));
});