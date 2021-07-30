"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ = _interopRequireDefault(require("../"));

var mockStatus = 202;
var mockStatusText = 'Success';
jest.mock('mailersend', function () {
  return {
    __esModule: true,
    "default": /*#__PURE__*/function () {
      function _default() {
        (0, _classCallCheck2["default"])(this, _default);
      }

      (0, _createClass2["default"])(_default, [{
        key: "send",
        value: function send() {
          return {
            status: mockStatus,
            statusText: mockStatusText
          };
        }
      }]);
      return _default;
    }(),
    Recipient: function Recipient() {
      (0, _classCallCheck2["default"])(this, Recipient);
    },
    EmailParams: /*#__PURE__*/function () {
      function mockEmailParams() {
        (0, _classCallCheck2["default"])(this, mockEmailParams);
      }

      (0, _createClass2["default"])(mockEmailParams, [{
        key: "setFrom",
        value: function setFrom() {
          return this;
        }
      }, {
        key: "setFromName",
        value: function setFromName() {
          return this;
        }
      }, {
        key: "setRecipients",
        value: function setRecipients() {
          return this;
        }
      }, {
        key: "setSubject",
        value: function setSubject() {
          return this;
        }
      }, {
        key: "setTemplateId",
        value: function setTemplateId() {
          return this;
        }
      }, {
        key: "setPersonalization",
        value: function setPersonalization() {
          return this;
        }
      }]);
      return mockEmailParams;
    }()
  };
});
var mockLinkAdd = jest.fn();
jest.mock("../../link", function () {
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
    }()
  };
});
describe('lib/email', function () {
  beforeEach(function () {
    mockLinkAdd.mockReset();
    mockLinkAdd.mockImplementation(function () {
      return {};
    });
  });
  test('subscribe', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _["default"].subscribe('email', 'id');

          case 2:
            expect(mockLinkAdd).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  test('recover', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _["default"].recover('email');

          case 2:
            expect(mockLinkAdd).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  test('send error', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            mockStatus = 401;
            mockStatusText = 'Unauthorized';
            _context4.prev = 2;
            _context4.next = 5;
            return _["default"].recover('email');

          case 5:
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](2);
            expect(_context4.t0.message).toBe('Unauthorized');

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 7]]);
  })));
});