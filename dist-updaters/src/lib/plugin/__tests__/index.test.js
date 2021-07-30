"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require("../"));

var mockInit = jest.fn();
jest.mock("../../../../plugins/api", function () {
  return {
    key: {
      init: function init() {
        return mockInit();
      }
    }
  };
});
var mockGet = jest.fn();
var mockUpdate = jest.fn();
jest.mock("../../user", function () {
  return {
    get: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", mockGet());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function get() {
        return _get.apply(this, arguments);
      }

      return get;
    }(),
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", mockUpdate());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  };
});
describe('lib/plugin', function () {
  beforeEach(function () {
    mockInit.mockReset();
    mockGet.mockReset();
    mockGet.mockImplementation(function () {
      return {};
    });
    mockUpdate.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _["default"].add({
              id: 'id'
            }, {});

          case 2:
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            mockGet.mockImplementation(function () {
              return {
                plugins: [{}]
              };
            }); // Init (without API)

            _context3.next = 7;
            return _["default"].add({
              id: 'id'
            }, {
              key: 'nokey',
              needInit: true
            });

          case 7:
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(2);
            expect(mockInit).toHaveBeenCalledTimes(0); // Init (with API)

            _context3.next = 12;
            return _["default"].add({
              id: 'id'
            }, {
              key: 'key',
              needInit: true
            });

          case 12:
            expect(mockGet).toHaveBeenCalledTimes(3);
            expect(mockUpdate).toHaveBeenCalledTimes(3);
            expect(mockInit).toHaveBeenCalledTimes(1);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test('getByUser', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var plugins;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _["default"].getByUser({
              id: 'id'
            });

          case 2:
            plugins = _context4.sent;
            expect(plugins).toEqual([]);
            mockGet.mockImplementation(function () {
              return {
                plugins: [{}]
              };
            });
            _context4.next = 7;
            return _["default"].getByUser({
              id: 'id'
            });

          case 7:
            plugins = _context4.sent;
            expect(plugins).toEqual([{}]);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  test('update', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _["default"].update({
              id: 'id'
            }, {
              uuid: 'uuid'
            });

          case 2:
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(0); // Normal

            mockGet.mockImplementation(function () {
              return {
                plugins: [{
                  uuid: 'uuid'
                }]
              };
            });
            _context5.next = 7;
            return _["default"].update({
              id: 'id'
            }, {
              uuid: 'uuid'
            });

          case 7:
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(1); // Re-init

            mockGet.mockImplementation(function () {
              return {
                plugins: [{
                  uuid: 'uuid'
                }]
              };
            });
            _context5.next = 12;
            return _["default"].update({
              id: 'id'
            }, {
              key: 'nokey',
              uuid: 'uuid',
              needInit: true,
              needReInit: true
            });

          case 12:
            expect(mockGet).toHaveBeenCalledTimes(3);
            expect(mockUpdate).toHaveBeenCalledTimes(2);
            _context5.next = 16;
            return _["default"].update({
              id: 'id'
            }, {
              key: 'key',
              uuid: 'uuid',
              needInit: true,
              needReInit: true
            });

          case 16:
            expect(mockGet).toHaveBeenCalledTimes(4);
            expect(mockUpdate).toHaveBeenCalledTimes(3); // Not found

            _context5.next = 20;
            return _["default"].update({
              id: 'id'
            }, {
              uuid: 'nouuid',
              needInit: true,
              needReInit: true
            });

          case 20:
            expect(mockGet).toHaveBeenCalledTimes(5);
            expect(mockUpdate).toHaveBeenCalledTimes(3);

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  test('del', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _["default"].del({
              id: 'id'
            }, {
              uuid: 'uuid'
            });

          case 2:
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(0); // Normal

            mockGet.mockImplementation(function () {
              return {
                plugins: [{
                  uuid: 'uuid'
                }]
              };
            });
            _context6.next = 7;
            return _["default"].del({
              id: 'id'
            }, {
              uuid: 'uuid'
            });

          case 7:
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(1); // Not found

            _context6.next = 11;
            return _["default"].del({
              id: 'id'
            }, {
              uuid: 'nouuid'
            });

          case 11:
            expect(mockGet).toHaveBeenCalledTimes(3);
            expect(mockUpdate).toHaveBeenCalledTimes(1);

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
});