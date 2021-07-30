"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _group = _interopRequireDefault(require("../../database/group"));

var _user = _interopRequireDefault(require("../user"));

var _workspace = _interopRequireDefault(require("../workspace"));

var _project = _interopRequireDefault(require("../project"));

var _organization = _interopRequireDefault(require("../organization"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Add group
 * @param {Object} organization Organization { id }
 * @param {Object} group Group
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(organization, _ref) {
    var name, users, group;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = _ref.name, users = _ref.users;
            _context.next = 3;
            return _group["default"].add(organization, {
              name: name,
              users: users
            });

          case 3:
            group = _context.sent;

            // Add group to organization
            _organization["default"].update(organization, [{
              key: 'groups',
              type: 'array',
              method: 'append',
              value: group.id
            }]);

            return _context.abrupt("return", group);

          case 6:
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
 * Get
 * @param {string} id Id
 * @param {Array} data Data
 */


var get = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id, data) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", _group["default"].get(id, data));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function get(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Get (with auto-fill users data)
 * @param {string} id Id
 * @param {Array} data Data
 */


var getWithFill = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id, data) {
    var groupData;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return get(id, data);

          case 2:
            groupData = _context4.sent;
            _context4.t0 = groupData.users;

            if (!_context4.t0) {
              _context4.next = 8;
              break;
            }

            _context4.next = 7;
            return Promise.all(groupData.users.map( /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(user) {
                var userData;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _user["default"].get(user, ['firstname', 'lastname', 'email', 'avatar']);

                      case 2:
                        userData = _context3.sent;
                        return _context3.abrupt("return", _objectSpread({
                          id: user
                        }, userData));

                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x7) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 7:
            groupData.users = _context4.sent;

          case 8:
            return _context4.abrupt("return", groupData);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getWithFill(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Get all users
 * @param {Array} data Data
 */


var getAll = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(data) {
    var groups;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _group["default"].getAll(data);

          case 2:
            groups = _context7.sent;
            _context7.next = 5;
            return Promise.all(groups.map( /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(group, index) {
                var users;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        if (!group.users) {
                          _context6.next = 5;
                          break;
                        }

                        _context6.next = 3;
                        return Promise.all(group.users.map( /*#__PURE__*/function () {
                          var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(user) {
                            var userData;
                            return _regenerator["default"].wrap(function _callee5$(_context5) {
                              while (1) {
                                switch (_context5.prev = _context5.next) {
                                  case 0:
                                    _context5.next = 2;
                                    return _user["default"].get(user, ['firstname', 'lastname', 'email', 'avatar']);

                                  case 2:
                                    userData = _context5.sent;
                                    return _context5.abrupt("return", _objectSpread({
                                      id: user
                                    }, userData));

                                  case 4:
                                  case "end":
                                    return _context5.stop();
                                }
                              }
                            }, _callee5);
                          }));

                          return function (_x11) {
                            return _ref8.apply(this, arguments);
                          };
                        }()));

                      case 3:
                        users = _context6.sent;
                        groups[index].users = users;

                      case 5:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x9, _x10) {
                return _ref7.apply(this, arguments);
              };
            }()));

          case 5:
            return _context7.abrupt("return", groups);

          case 6:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getAll(_x8) {
    return _ref6.apply(this, arguments);
  };
}();

var getByOrganization = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(id, data) {
    var organization;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _organization["default"].get(id, ['groups']);

          case 2:
            organization = _context9.sent;
            return _context9.abrupt("return", organization.groups && Promise.all(organization.groups.map( /*#__PURE__*/function () {
              var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(group) {
                var groupData;
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return getWithFill(group, data);

                      case 2:
                        groupData = _context8.sent;
                        return _context8.abrupt("return", _objectSpread({
                          id: group
                        }, groupData));

                      case 4:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x14) {
                return _ref10.apply(this, arguments);
              };
            }())));

          case 4:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function getByOrganization(_x12, _x13) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * Update group
 * @param {Object} group Group { id }
 * @param {Array} data Data
 */


var update = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(group, data) {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _group["default"].update(group, data);

          case 2:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function update(_x15, _x16) {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * Delete group
 * @param {Object} group Group { id }
 */


var del = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(group) {
    var groupData;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return get(group.id, ['users', 'workspaces', 'projects', 'organization']);

          case 2:
            groupData = _context13.sent;
            _context13.next = 5;
            return _organization["default"].update({
              id: groupData.organization
            }, [{
              key: 'groups',
              type: 'array',
              method: 'remove',
              value: group.id
            }]);

          case 5:
            _context13.t0 = groupData.workspaces;

            if (!_context13.t0) {
              _context13.next = 9;
              break;
            }

            _context13.next = 9;
            return Promise.all(groupData.workspaces.map( /*#__PURE__*/function () {
              var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(workspace) {
                return _regenerator["default"].wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return _workspace["default"].update({
                          id: workspace
                        }, [{
                          key: 'groups',
                          type: 'array',
                          method: 'remove',
                          value: group.id
                        }]);

                      case 2:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));

              return function (_x18) {
                return _ref13.apply(this, arguments);
              };
            }()));

          case 9:
            _context13.t1 = groupData.projects;

            if (!_context13.t1) {
              _context13.next = 13;
              break;
            }

            _context13.next = 13;
            return Promise.all(groupData.projects.map( /*#__PURE__*/function () {
              var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(project) {
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return _project["default"].update({
                          id: project
                        }, [{
                          key: 'groups',
                          type: 'array',
                          method: 'remove',
                          value: group.id
                        }]);

                      case 2:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function (_x19) {
                return _ref14.apply(this, arguments);
              };
            }()));

          case 13:
            _context13.next = 15;
            return _group["default"].del(group);

          case 15:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function del(_x17) {
    return _ref12.apply(this, arguments);
  };
}();

var Group = {
  add: add,
  get: getWithFill,
  getAll: getAll,
  getByOrganization: getByOrganization,
  update: update,
  del: del
};
var _default = Group;
exports["default"] = _default;