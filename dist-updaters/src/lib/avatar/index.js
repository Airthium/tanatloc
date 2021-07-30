"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _storage = require("../../../config/storage");

var _avatar = _interopRequireDefault(require("../../database/avatar"));

var _user = _interopRequireDefault(require("../user"));

var _project = _interopRequireDefault(require("../project"));

var _tools = _interopRequireDefault(require("../tools"));

/** @module lib/avatar */

/**
 * Add avatar
 * @param {Object} parent Parent { id }
 * @param {string} type Type (project or user)
 * @param {File} file File { name, uid, data }
 */
var add = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(parent, type, file) {
    var avatar, userData, projectData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _tools["default"].writeFile(_storage.AVATAR, file.uid, file.data);

          case 2:
            _context.next = 4;
            return _avatar["default"].add({
              name: file.name,
              path: file.uid
            });

          case 4:
            avatar = _context.sent;

            if (!(type === 'user')) {
              _context.next = 16;
              break;
            }

            _context.next = 8;
            return _user["default"].get(parent.id, ['avatar'], false);

          case 8:
            userData = _context.sent;

            if (!userData.avatar) {
              _context.next = 12;
              break;
            }

            _context.next = 12;
            return del(parent, type, userData.avatar);

          case 12:
            _context.next = 14;
            return _user["default"].update(parent, [{
              key: 'avatar',
              value: avatar.id
            }]);

          case 14:
            _context.next = 24;
            break;

          case 16:
            _context.next = 18;
            return _project["default"].get(parent.id, ['avatar'], false);

          case 18:
            projectData = _context.sent;

            if (!projectData.avatar) {
              _context.next = 22;
              break;
            }

            _context.next = 22;
            return del(parent, type, projectData.avatar);

          case 22:
            _context.next = 24;
            return _project["default"].update(parent, [{
              key: 'avatar',
              value: avatar.id
            }]);

          case 24:
            return _context.abrupt("return", avatar);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function add(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Read avatar
 * @param {string} id Avatar's id
 */


var read = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
    var avatar, avatarFile;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return get(id, ['path']);

          case 2:
            avatar = _context2.sent;
            // Read file
            avatarFile = _path["default"].join(_storage.AVATAR, avatar.path);
            return _context2.abrupt("return", _tools["default"].readFile(avatarFile));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function read(_x4) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Get
 * @param {string} id Id
 * @param {Array} data Data
 */


var get = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id, data) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", _avatar["default"].get(id, data));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function get(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Delete avatar
 * @param {Object} parent Parent { id }
 * @param {string} type Type (project or user)
 * @param {string} id Avatar's id
 */


var del = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(parent, type, id) {
    var data, avatarFile;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return get(id, ['path']);

          case 2:
            data = _context4.sent;

            if (!data.path) {
              _context4.next = 13;
              break;
            }

            avatarFile = _path["default"].join(_storage.AVATAR, data.path);
            _context4.prev = 5;
            _context4.next = 8;
            return _tools["default"].removeFile(avatarFile);

          case 8:
            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](5);
            console.error(_context4.t0);

          case 13:
            if (!(type === 'user')) {
              _context4.next = 18;
              break;
            }

            _context4.next = 16;
            return _user["default"].update(parent, [{
              key: 'avatar',
              value: null
            }]);

          case 16:
            _context4.next = 20;
            break;

          case 18:
            _context4.next = 20;
            return _project["default"].update(parent, [{
              key: 'avatar',
              value: null
            }]);

          case 20:
            _context4.next = 22;
            return _avatar["default"].del(id);

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[5, 10]]);
  }));

  return function del(_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

var Avatar = {
  add: add,
  read: read,
  get: get,
  del: del
};
var _default = Avatar;
exports["default"] = _default;