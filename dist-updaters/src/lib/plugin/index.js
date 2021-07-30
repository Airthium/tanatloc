"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash.merge"));

var _user = _interopRequireDefault(require("../user"));

var _api = _interopRequireDefault(require("../../../plugins/api"));

/** @module lib/plugin */

/**
 * Add plugin
 * @param {Object} user User { id }
 * @param {Object} plugin Plugin
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref, plugin) {
    var id, user, API, init;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = _ref.id;
            _context.next = 3;
            return _user["default"].get(id, ['plugins']);

          case 3:
            user = _context.sent;
            if (!user.plugins) user.plugins = [];
            user.plugins = [].concat((0, _toConsumableArray2["default"])(user.plugins), [plugin]); // Plugin initialization

            if (!plugin.needInit) {
              _context.next = 13;
              break;
            }

            API = _api["default"][plugin.key];

            if (!API) {
              _context.next = 13;
              break;
            }

            _context.next = 11;
            return API.init(plugin.configuration);

          case 11:
            init = _context.sent;
            (0, _lodash["default"])(plugin, init);

          case 13:
            _context.next = 15;
            return _user["default"].update({
              id: id
            }, [{
              key: 'plugins',
              value: user.plugins
            }]);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function add(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Get by user
 * @param {string} user User { id }
 */


var getByUser = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
    var id, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = _ref3.id;
            _context2.next = 3;
            return _user["default"].get(id, ['plugins']);

          case 3:
            user = _context2.sent;
            return _context2.abrupt("return", user.plugins || []);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getByUser(_x3) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Update
 * @param {User} user User { id }
 * @param {Object} plugin Plugin
 */


var update = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref5, plugin) {
    var id, user, index, API, init;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = _ref5.id;
            _context3.next = 3;
            return _user["default"].get(id, ['plugins']);

          case 3:
            user = _context3.sent;

            if (user.plugins) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return");

          case 6:
            index = user.plugins.findIndex(function (p) {
              return p.uuid === plugin.uuid;
            });

            if (!(index === -1)) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return");

          case 9:
            user.plugins = [].concat((0, _toConsumableArray2["default"])(user.plugins.slice(0, index)), [plugin], (0, _toConsumableArray2["default"])(user.plugins.slice(index + 1))); // Re-init

            if (!(plugin.needInit && plugin.needReInit)) {
              _context3.next = 18;
              break;
            }

            API = _api["default"][plugin.key];

            if (!API) {
              _context3.next = 17;
              break;
            }

            _context3.next = 15;
            return API.init(plugin.configuration);

          case 15:
            init = _context3.sent;
            (0, _lodash["default"])(plugin, init);

          case 17:
            plugin.needReInit = false;

          case 18:
            _context3.next = 20;
            return _user["default"].update({
              id: id
            }, [{
              key: 'plugins',
              value: user.plugins
            }]);

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function update(_x4, _x5) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 *
 * @param {Object} user User { id }
 * @param {Object} plugin Plugin { uuid }
 */


var del = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref7, plugin) {
    var id, user, index;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = _ref7.id;
            _context4.next = 3;
            return _user["default"].get(id, ['plugins']);

          case 3:
            user = _context4.sent;

            if (user.plugins) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return");

          case 6:
            index = user.plugins.findIndex(function (p) {
              return p.uuid === plugin.uuid;
            });

            if (!(index === -1)) {
              _context4.next = 9;
              break;
            }

            return _context4.abrupt("return");

          case 9:
            user.plugins = [].concat((0, _toConsumableArray2["default"])(user.plugins.slice(0, index)), (0, _toConsumableArray2["default"])(user.plugins.slice(index + 1))); // Update

            _context4.next = 12;
            return _user["default"].update({
              id: id
            }, [{
              key: 'plugins',
              value: user.plugins
            }]);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function del(_x6, _x7) {
    return _ref8.apply(this, arguments);
  };
}();

var Plugin = {
  add: add,
  getByUser: getByUser,
  update: update,
  del: del
};
var _default = Plugin;
exports["default"] = _default;