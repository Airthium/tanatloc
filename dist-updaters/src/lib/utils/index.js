"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _tooltip = _interopRequireDefault(require("antd/lib/tooltip"));

var _avatar = _interopRequireDefault(require("antd/lib/avatar"));

var _spin = _interopRequireDefault(require("antd/lib/spin"));

var __jsx = _react["default"].createElement;

/**
 * String to color
 * @param {string} str String
 */
var stringToColor = function stringToColor(str) {
  if (!str) return '#FFFFFF';
  str = str.replace(/[\W_]+/g, '');
  var hash = 0;

  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};
/**
 * Component to Hex
 * @param {number} c Color
 */


var componentToHex = function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};
/**
 * RGB to Hex
 * @param {Object} color Color {r, g, b}
 */


var rgbToHex = function rgbToHex(color) {
  return '#' + componentToHex(color.r * 255) + componentToHex(color.g * 255) + componentToHex(color.b * 255);
};
/**
 * rgb to CSS rgba
 * @param {Object} color Color {r, g, b}
 * @param {number} alpha Alpha
 */


var rgbToRgba = function rgbToRgba(color) {
  var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  if (!color) return 'rgba(255, 255, 255, 0)';
  return 'rgba(' + color.r * 255 + ', ' + color.g * 255 + ', ' + color.b * 255 + ', ' + alpha + ')';
};
/**
 * User to avatar
 * @param {Object} user User
 */


var userToAvatar = function userToAvatar(user) {
  var avatar = user.avatar && Buffer.from(user.avatar).toString();
  var name = '';
  var abbrev = '';

  if (user.firstname || user.lastname) {
    name = user.firstname + ' ' + user.lastname;
    abbrev = (user.firstname && user.firstname[0]) + (user.lastname && user.lastname[0]);
  } else if (user.email) {
    name = user.email;
    abbrev = user.email[0];
  }

  return __jsx(_tooltip["default"], {
    key: user.id || user,
    title: name
  }, __jsx(_avatar["default"], {
    src: avatar,
    style: {
      backgroundColor: stringToColor(name)
    }
  }, abbrev.toUpperCase() || __jsx(_spin["default"], null)));
};
/**
 * Group to avatar
 * @param {Object} group Group
 */


var groupToAvatar = function groupToAvatar(group) {
  var name = group.name;
  var abbrev = '';
  if (name) abbrev = name[0];
  return __jsx(_tooltip["default"], {
    key: group.id || group,
    title: name
  }, __jsx(_avatar["default"], {
    style: {
      backgroundColor: stringToColor(name)
    }
  }, abbrev.toUpperCase() || __jsx(_spin["default"], null)));
};
/**
 * Validate email
 * @param {string} email Email
 * @returns {bool} Valid
 */


var validateEmail = function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

var Utils = {
  stringToColor: stringToColor,
  rgbToHex: rgbToHex,
  rgbToRgba: rgbToRgba,
  userToAvatar: userToAvatar,
  groupToAvatar: groupToAvatar,
  validateEmail: validateEmail
};
var _default = Utils;
exports["default"] = _default;