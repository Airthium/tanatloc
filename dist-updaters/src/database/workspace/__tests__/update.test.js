"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _update = _interopRequireDefault(require("../update"));

var mockUpdate = jest.fn();
jest.mock("../..", function () {
  return {
    updater: function () {
      var _updater = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", mockUpdate());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function updater() {
        return _updater.apply(this, arguments);
      }

      return updater;
    }()
  };
});
describe('database/workspace/update', function () {
  test('update', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _update["default"])({}, [{
              key: 'test',
              value: 'test'
            }]);

          case 2:
            expect(mockUpdate).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});