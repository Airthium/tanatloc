"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _ = _interopRequireWildcard(require(".."));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var mockQuery = jest.fn(function () {
  return 'query';
});
jest.mock('pg', function () {
  return {
    Pool: function PoolMock() {
      (0, _classCallCheck2["default"])(this, PoolMock);
      this.connect = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", {
                  query: function () {
                    var _query = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                      return _regenerator["default"].wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              return _context.abrupt("return", mockQuery());

                            case 1:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }));

                    function query() {
                      return _query.apply(this, arguments);
                    }

                    return query;
                  }(),
                  release: jest.fn()
                });

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      this.query = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", 'query');

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      this.end = jest.fn();
    }
  };
});
jest.mock("../../../config/db", function () {
  return {};
});
describe('database', function () {
  test('query', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var res;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _["default"])();

          case 2:
            res = _context4.sent;
            expect(res).toBe('query');

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test('getter', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var get;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _.getter)('db', 'id', []);

          case 2:
            get = _context5.sent;
            expect(get).toBe('query');

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  test('updater', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _.updater)('db', 'id', [{
              key: 'key1'
            }, {
              key: 'key2',
              type: 'crypt'
            }, {
              key: 'key3',
              type: 'array',
              method: 'append'
            }, {
              key: 'key4',
              type: 'array',
              method: 'remove'
            }, {
              key: 'key5',
              type: 'json',
              method: 'set',
              path: ['first', 'second'],
              value: 'value'
            }, {
              key: 'key6',
              type: 'json',
              method: 'erase',
              path: ['first', 'second']
            }]);

          case 2:
            _context6.next = 4;
            return (0, _.updater)('db', null, [{
              key: 'key'
            }]);

          case 4:
            _context6.prev = 4;
            _context6.next = 7;
            return (0, _.updater)('db', 'id', [{
              key: 'key'
            }, {
              key: 'key'
            }]);

          case 7:
            expect(true).toBe(false);
            _context6.next = 13;
            break;

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](4);
            expect(true).toBe(true);

          case 13:
            _context6.prev = 13;
            _context6.next = 16;
            return (0, _.updater)('db', 'id', [{
              key: 'key',
              type: 'array'
            }]);

          case 16:
            expect(true).toBe(false);
            _context6.next = 22;
            break;

          case 19:
            _context6.prev = 19;
            _context6.t1 = _context6["catch"](13);
            expect(true).toBe(true);

          case 22:
            _context6.prev = 22;
            _context6.next = 25;
            return (0, _.updater)('db', 'id', [{
              key: 'key',
              type: 'json',
              method: 'set',
              path: ['first', 'second']
            }]);

          case 25:
            expect(true).toBe(false);
            _context6.next = 31;
            break;

          case 28:
            _context6.prev = 28;
            _context6.t2 = _context6["catch"](22);
            expect(true).toBe(true);

          case 31:
            _context6.prev = 31;
            _context6.next = 34;
            return (0, _.updater)('db', 'id', [{
              key: 'key',
              type: 'json'
            }]);

          case 34:
            expect(true).toBe(false);
            _context6.next = 40;
            break;

          case 37:
            _context6.prev = 37;
            _context6.t3 = _context6["catch"](31);
            expect(true).toBe(true);

          case 40:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[4, 10], [13, 19], [22, 28], [31, 37]]);
  })));
  test('deleter', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _.deleter)();

          case 2:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
});