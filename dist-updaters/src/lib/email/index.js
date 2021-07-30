"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mailersend = _interopRequireWildcard(require("mailersend"));

var _domain = require("../../../config/domain");

var _email = require("../../../config/email");

var _link = _interopRequireDefault(require("../link"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @module lib/email */
var mailerSend = new _mailersend["default"]({
  api_key: _email.TOKEN
});

var send = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(email) {
    var res;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return mailerSend.send(email);

          case 2:
            res = _context.sent;

            if (!(res.status !== 202)) {
              _context.next = 5;
              break;
            }

            throw new Error(res.statusText);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function send(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Subscribe
 * @param {string} email Email
 * @param {string} userid User id
 */


var subscribe = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(email, userid) {
    var link, subscribeLink, recipients, personalization, emailParams;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _link["default"].add({
              type: _email.SUBSCRIBE,
              email: email,
              userid: userid
            });

          case 2:
            link = _context2.sent;
            subscribeLink = _domain.DOMAIN + '/signup/validation?id=' + link.id;
            recipients = [new _mailersend.Recipient(email)];
            personalization = [{
              email: email,
              data: {
                subscribeLink: subscribeLink
              }
            }];
            emailParams = new _mailersend.EmailParams().setFrom('noreply@tanatloc.com').setFromName('Tanatloc').setRecipients(recipients).setSubject('Tanatloc subscription').setTemplateId('3vz9dle2p6lkj50y').setPersonalization(personalization);
            _context2.next = 9;
            return send(emailParams);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function subscribe(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var recover = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(email) {
    var link, recoveryLink, recipients, personalization, emailParams;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _link["default"].add({
              type: _email.PASSWORD_RECOVERY,
              email: email
            });

          case 2:
            link = _context3.sent;
            recoveryLink = _domain.DOMAIN + '/password?id=' + link.id;
            recipients = [new _mailersend.Recipient(email)];
            personalization = [{
              email: email,
              data: {
                recoveryLink: recoveryLink
              }
            }];
            emailParams = new _mailersend.EmailParams().setFrom('noreply@tanatloc.com').setFromName('Tanatloc').setRecipients(recipients).setSubject('Recover your password').setTemplateId('vywj2lp7n1l7oqzd').setPersonalization(personalization);
            _context3.next = 9;
            return send(emailParams);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function recover(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Revalidate
 * @param {string} email Email
 * @param {string} userid User id
 */


var revalidate = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(email, userid) {
    var link, subscribeLink, recipients, personalization, emailParams;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _link["default"].add({
              type: _email.REVALIDATE,
              email: email,
              userid: userid
            });

          case 2:
            link = _context4.sent;
            subscribeLink = _domain.DOMAIN + '/signup/validation?id=' + link.id;
            recipients = [new _mailersend.Recipient(email)];
            personalization = [{
              email: email,
              data: {
                subscribeLink: subscribeLink
              }
            }];
            emailParams = new _mailersend.EmailParams().setFrom('noreply@tanatloc.com').setFromName('Tanatloc').setRecipients(recipients).setSubject('Validate your email').setTemplateId('jy7zpl9xq5l5vx6k').setPersonalization(personalization);
            _context4.next = 9;
            return send(emailParams);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function revalidate(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Invite
 * @param {string} email Email
 * @param {string} user Sending user
 */


var invite = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(email, user) {
    var subscribeLink, recipients, userName, personalization, emailParams;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            subscribeLink = _domain.DOMAIN + '/login';
            recipients = [new _mailersend.Recipient(email)];
            userName = '';
            if (user.firstname || user.lastname) userName = user.firstname + ' ' + user.lastname;else userName = user.email;
            personalization = [{
              email: email,
              data: {
                user: userName,
                subscribeLink: subscribeLink
              }
            }];
            emailParams = new _mailersend.EmailParams().setFrom('noreply@tanatloc.com').setFromName('Tanatloc').setRecipients(recipients).setSubject('Your have been invited').setTemplateId('jy7zpl9x95l5vx6k').setPersonalization(personalization);
            _context5.next = 8;
            return send(emailParams);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function invite(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

var Email = {
  subscribe: subscribe,
  recover: recover,
  revalidate: revalidate,
  invite: invite
};
var _default = Email;
exports["default"] = _default;