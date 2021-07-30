"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _add = _interopRequireDefault(require("../add"));

var mockQuery = jest.fn();
jest.mock("../..", function () {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(query) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", mockQuery(query));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
});
describe('database/user/add', function () {
  test('call', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // New
            mockQuery.mockImplementation(function (query) {
              if (query.includes('SELECT')) return {
                rows: []
              };else return {
                rows: [{
                  id: 'id'
                }]
              };
            });
            _context2.next = 3;
            return (0, _add["default"])({
              email: 'email',
              password: 'password'
            });

          case 3:
            user = _context2.sent;
            expect(user).toEqual({
              id: 'id'
            }); // Already existing

            mockQuery.mockImplementation(function () {
              return {
                rows: [{}]
              };
            });
            _context2.next = 8;
            return (0, _add["default"])({
              email: 'email',
              password: 'password'
            });

          case 8:
            user = _context2.sent;
            expect(user).toEqual({
              alreadyExists: true
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});