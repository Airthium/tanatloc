"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _call = _interopRequireDefault(require("../call"));

jest.mock('url-join', function () {
  return function () {
    return 'url';
  };
});
var mockFetch = jest.fn();
jest.mock('node-fetch', function () {
  return /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", mockFetch());

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
});
describe('plugins/rescale/src/lib/call', function () {
  test('json', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            mockFetch.mockImplementation(function () {
              return {
                headers: {
                  get: function get() {
                    return 'application/json';
                  }
                },
                json: function () {
                  var _json = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            return _context2.abrupt("return", {});

                          case 1:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  function json() {
                    return _json.apply(this, arguments);
                  }

                  return json;
                }()
              };
            });
            _context3.next = 3;
            return (0, _call["default"])({});

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test('json with next', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var count;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            count = 0;
            mockFetch.mockImplementation(function () {
              count++;
              return {
                headers: {
                  get: function get() {
                    return 'application/json';
                  }
                },
                json: function () {
                  var _json2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            return _context4.abrupt("return", {
                              next: count === 1,
                              results: []
                            });

                          case 1:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  function json() {
                    return _json2.apply(this, arguments);
                  }

                  return json;
                }()
              };
            });
            _context5.next = 4;
            return (0, _call["default"])({});

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  test('text/plain', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            mockFetch.mockImplementation(function () {
              return {
                headers: {
                  get: function get() {
                    return 'text/plain';
                  }
                },
                text: function () {
                  var _text = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
                    return _regenerator["default"].wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            return _context6.abrupt("return", 'text');

                          case 1:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));

                  function text() {
                    return _text.apply(this, arguments);
                  }

                  return text;
                }()
              };
            });
            _context7.next = 3;
            return (0, _call["default"])({});

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  test('application/octet-stream', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            mockFetch.mockImplementation(function () {
              return {
                headers: {
                  get: function get() {
                    return 'application/octet-stream';
                  }
                },
                text: function () {
                  var _text2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
                    return _regenerator["default"].wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            return _context8.abrupt("return", 'text');

                          case 1:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8);
                  }));

                  function text() {
                    return _text2.apply(this, arguments);
                  }

                  return text;
                }()
              };
            });
            _context9.next = 3;
            return (0, _call["default"])({});

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
  test('non json', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            mockFetch.mockImplementation(function () {
              return {
                headers: {
                  get: function get() {
                    return 'other';
                  }
                }
              };
            });
            _context10.next = 3;
            return (0, _call["default"])({});

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  })));
  test('error', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            mockFetch.mockImplementation(function () {
              throw new Error();
            });
            _context11.prev = 1;
            _context11.next = 4;
            return (0, _call["default"])({});

          case 4:
            expect(true).toBe(false);
            _context11.next = 10;
            break;

          case 7:
            _context11.prev = 7;
            _context11.t0 = _context11["catch"](1);
            expect(true).toBe(true);

          case 10:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[1, 7]]);
  })));
});