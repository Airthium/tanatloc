"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = _interopRequireDefault(require("../../database/user"));

var _avatar = _interopRequireDefault(require("../avatar"));

var _group = _interopRequireDefault(require("../group"));

var _workspace = _interopRequireDefault(require("../workspace"));

var _email = _interopRequireDefault(require("../email"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Add user
 * @param {Object} user { email, password }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var email, password, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = _ref.email, password = _ref.password;
            _context.next = 3;
            return _user["default"].add({
              email: email,
              password: password
            });

          case 3:
            user = _context.sent;

            if (user.alreadyExists) {
              _context.next = 7;
              break;
            }

            _context.next = 7;
            return _email["default"].subscribe(email, user.id);

          case 7:
            return _context.abrupt("return", user);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function add(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Get user
 * @param {string} id User's id
 * @param {Array} data Data
 * @param {boolean} readAvatar Read avatar ? (default: true)
 */


var get = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id, data) {
    var readAvatar,
        user,
        avatar,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            readAvatar = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : true;
            _context2.next = 3;
            return _user["default"].get(id, data);

          case 3:
            user = _context2.sent;

            if (!(readAvatar && user && user.avatar)) {
              _context2.next = 16;
              break;
            }

            _context2.prev = 5;
            _context2.next = 8;
            return _avatar["default"].read(user.avatar);

          case 8:
            avatar = _context2.sent;
            user.avatar = avatar;
            _context2.next = 16;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](5);
            console.warn(_context2.t0);
            user.avatar = undefined;

          case 16:
            return _context2.abrupt("return", user);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[5, 12]]);
  }));

  return function get(_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

var getBy = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id, data, key) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", _user["default"].get(id, data, key));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getBy(_x4, _x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Get all users
 * @param {Array} data Data
 */


var getAll = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", _user["default"].getAll(data));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getAll(_x7) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Login
 * @param {Object} data Data { email, password }
 */


var login = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref6) {
    var email, password, user;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            email = _ref6.email, password = _ref6.password;
            _context5.next = 3;
            return _user["default"].getByUsernameAndPassword({
              email: email,
              password: password
            });

          case 3:
            user = _context5.sent;

            if (user) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", null);

          case 6:
            return _context5.abrupt("return", _objectSpread(_objectSpread({}, user), {}, {
              email: email
            }));

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function login(_x8) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Update user
 * @param {Object} user user { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */


var update = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(user, data) {
    var emailData;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // Check email change
            emailData = data.find(function (d) {
              return d.key === 'email';
            });

            if (emailData) {
              // Revalidate email
              _email["default"].revalidate(emailData.value, user.id);

              data.push({
                key: 'isvalidated',
                value: false
              });
            }

            _context6.next = 4;
            return _user["default"].update(user, data);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function update(_x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * Delete user
 * @param {Object} user User { id }
 */


var del = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(user) {
    var data;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return get(user.id, ['workspaces', 'avatar'], false);

          case 2:
            data = _context9.sent;

            if (!data.groups) {
              _context9.next = 6;
              break;
            }

            _context9.next = 6;
            return Promise.all(data.groups.map( /*#__PURE__*/function () {
              var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(group) {
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return _group["default"].update({
                          id: group
                        }, [{
                          key: 'users',
                          type: 'array',
                          method: 'remove',
                          value: user.id
                        }]);

                      case 2:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x12) {
                return _ref10.apply(this, arguments);
              };
            }()));

          case 6:
            if (!data.workspaces) {
              _context9.next = 9;
              break;
            }

            _context9.next = 9;
            return Promise.all(data.workspaces.map( /*#__PURE__*/function () {
              var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(workspace) {
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return _workspace["default"].del(user, {
                          id: workspace
                        });

                      case 2:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x13) {
                return _ref11.apply(this, arguments);
              };
            }()));

          case 9:
            if (!data.avatar) {
              _context9.next = 12;
              break;
            }

            _context9.next = 12;
            return _avatar["default"].del(user, data.avatar);

          case 12:
            _context9.next = 14;
            return _user["default"].del(user);

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function del(_x11) {
    return _ref9.apply(this, arguments);
  };
}();

var User = {
  login: login,
  add: add,
  get: get,
  getBy: getBy,
  getAll: getAll,
  update: update,
  del: del
};
var _default = User;
exports["default"] = _default;