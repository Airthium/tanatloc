"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _globals = require("@jest/globals");

var _ = _interopRequireDefault(require(".."));

var mockLinkAdd = jest.fn();
var mockLinkGet = jest.fn();
var mockLinkDel = jest.fn();
jest.mock("../../../database/link", function () {
  return {
    add: function () {
      var _add = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", mockLinkAdd());

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
                return _context2.abrupt("return", mockLinkGet());

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
                return _context3.abrupt("return", mockLinkDel());

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
var mockUserGetBy = jest.fn();
var mockUserUpdate = jest.fn();
jest.mock("../../user", function () {
  return {
    getBy: function () {
      var _getBy = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockUserGetBy());

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function getBy() {
        return _getBy.apply(this, arguments);
      }

      return getBy;
    }(),
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockUserUpdate());

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
describe('lib/link', function () {
  beforeEach(function () {
    mockLinkAdd.mockReset();
    mockLinkGet.mockReset();
    mockLinkDel.mockReset();
    mockUserGetBy.mockReset();
    mockUserUpdate.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _["default"].add({});

          case 2:
            (0, _globals.expect)(mockLinkAdd).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  test('get', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _["default"].get('id', ['data']);

          case 2:
            (0, _globals.expect)(mockLinkGet).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  test('process', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            // Subscribe
            mockLinkGet.mockImplementation(function () {
              return {
                type: 'subscribe',
                userid: 'userid'
              };
            });
            _context8.next = 3;
            return _["default"].process('id', {});

          case 3:
            (0, _globals.expect)(mockUserUpdate).toHaveBeenCalledTimes(1);
            (0, _globals.expect)(mockLinkDel).toHaveBeenCalledTimes(1); // Password recovery, wrong email

            mockLinkGet.mockImplementation(function () {
              return {
                type: 'passwordRecovery',
                email: 'email'
              };
            });
            _context8.prev = 6;
            _context8.next = 9;
            return _["default"].process('id', {
              email: 'otheremail'
            });

          case 9:
            _context8.next = 14;
            break;

          case 11:
            _context8.prev = 11;
            _context8.t0 = _context8["catch"](6);
            (0, _globals.expect)(_context8.t0.message).toBe('Inconsistent data');

          case 14:
            // Pasword recovery
            mockUserGetBy.mockImplementation(function () {
              return {};
            });
            _context8.next = 17;
            return _["default"].process('id', {
              email: 'email'
            });

          case 17:
            (0, _globals.expect)(mockUserGetBy).toHaveBeenCalledTimes(1);
            (0, _globals.expect)(mockUserUpdate).toHaveBeenCalledTimes(2);
            (0, _globals.expect)(mockLinkDel).toHaveBeenCalledTimes(2);

          case 20:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[6, 11]]);
  })));
  test('del', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _["default"].del({});

          case 2:
            (0, _globals.expect)(mockLinkDel).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
});