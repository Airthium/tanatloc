"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _email = require("../../../config/email");

var _link = _interopRequireDefault(require("../../database/link"));

var _user = _interopRequireDefault(require("../user"));

var add = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(link) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", _link["default"].add(link));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function add(_x) {
    return _ref.apply(this, arguments);
  };
}();

var get = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id, data) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", _link["default"].get(id, data));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function get(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var process = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id, data) {
    var link, user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return get(id, ['type', 'email', 'userid']);

          case 2:
            link = _context3.sent;

            if (!(link.type === _email.SUBSCRIBE || link.type === _email.REVALIDATE)) {
              _context3.next = 10;
              break;
            }

            _context3.next = 6;
            return _user["default"].update({
              id: link.userid
            }, [{
              key: 'isvalidated',
              value: 'true'
            }]);

          case 6:
            _context3.next = 8;
            return del({
              id: id
            });

          case 8:
            _context3.next = 20;
            break;

          case 10:
            if (!(link.type === _email.PASSWORD_RECOVERY)) {
              _context3.next = 20;
              break;
            }

            if (!(link.email !== data.email)) {
              _context3.next = 13;
              break;
            }

            throw new Error('Inconsistent data');

          case 13:
            _context3.next = 15;
            return _user["default"].getBy(data.email, ['id'], 'email');

          case 15:
            user = _context3.sent;
            _context3.next = 18;
            return _user["default"].update({
              id: user.id
            }, [{
              type: 'crypt',
              key: 'password',
              value: data.password
            }]);

          case 18:
            _context3.next = 20;
            return del({
              id: id
            });

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function process(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var del = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(link) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _link["default"].del(link);

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function del(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

var Link = {
  add: add,
  get: get,
  process: process,
  del: del
};
var _default = Link;
exports["default"] = _default;