"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _project = _interopRequireDefault(require("../../database/project"));

var _avatar = _interopRequireDefault(require("../avatar"));

var _user = _interopRequireDefault(require("../user"));

var _group = _interopRequireDefault(require("../group"));

var _workspace = _interopRequireDefault(require("../workspace"));

var _simulation = _interopRequireDefault(require("../simulation"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Add project
 * @param {Object} user User { id }
 * @param {Object} data Data { workspace: { id }, project: { title, description } }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user, _ref) {
    var id, _ref$project, title, description, project;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = _ref.workspace.id, _ref$project = _ref.project, title = _ref$project.title, description = _ref$project.description;
            _context.next = 3;
            return _project["default"].add(user, {
              id: id
            }, {
              title: title,
              description: description
            });

          case 3:
            project = _context.sent;
            _context.next = 6;
            return _workspace["default"].update({
              id: id
            }, [{
              type: 'array',
              method: 'append',
              key: 'projects',
              value: project.id
            }]);

          case 6:
            return _context.abrupt("return", project);

          case 7:
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
 * Get project
 * @param {string} id Project's id
 * @param {Array} data Data
 * @param {boolean} withData With data
 */


var get = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(id, data) {
    var withData,
        project,
        avatar,
        owners,
        users,
        groups,
        _args5 = arguments;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            withData = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : true;
            _context5.next = 3;
            return _project["default"].get(id, data);

          case 3:
            project = _context5.sent;

            if (!(withData && project !== null && project !== void 0 && project.avatar)) {
              _context5.next = 16;
              break;
            }

            _context5.prev = 5;
            _context5.next = 8;
            return _avatar["default"].read(project.avatar);

          case 8:
            avatar = _context5.sent;
            project.avatar = avatar;
            _context5.next = 16;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](5);
            console.warn(_context5.t0);
            project.avatar = undefined;

          case 16:
            if (!(withData && project !== null && project !== void 0 && project.owners)) {
              _context5.next = 21;
              break;
            }

            _context5.next = 19;
            return Promise.all(project.owners.map( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(owner) {
                var ownerData;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _user["default"].get(owner, ['lastname', 'firstname', 'email', 'avatar']);

                      case 2:
                        ownerData = _context2.sent;
                        return _context2.abrupt("return", _objectSpread({
                          id: owner
                        }, ownerData));

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 19:
            owners = _context5.sent;
            project.owners = owners;

          case 21:
            if (!(withData && project !== null && project !== void 0 && project.users)) {
              _context5.next = 26;
              break;
            }

            _context5.next = 24;
            return Promise.all(project.users.map( /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(user) {
                var userData;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _user["default"].get(user, ['lastname', 'firstname', 'email', 'avatar']);

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

              return function (_x6) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 24:
            users = _context5.sent;
            project.users = users;

          case 26:
            if (!(withData && project !== null && project !== void 0 && project.groups)) {
              _context5.next = 31;
              break;
            }

            _context5.next = 29;
            return Promise.all(project.groups.map( /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(group) {
                var groupData;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _group["default"].get(group, ['name']);

                      case 2:
                        groupData = _context4.sent;
                        return _context4.abrupt("return", _objectSpread({
                          id: group
                        }, groupData));

                      case 4:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x7) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 29:
            groups = _context5.sent;
            project.groups = groups;

          case 31:
            return _context5.abrupt("return", project);

          case 32:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[5, 12]]);
  }));

  return function get(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Update project
 * @param {Object} Project { id }
 * @param {Object} data Data [{ key, value, ...}, ...]
 */


var update = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(project, data) {
    var projectData, groupsUpdate, deleted, added;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return get(project.id, ['groups']);

          case 2:
            projectData = _context8.sent;
            if (!projectData.groups) projectData.groups = []; // Check groups

            groupsUpdate = data.find(function (d) {
              return d.key === 'groups' && !d.type;
            });

            if (!groupsUpdate) {
              _context8.next = 12;
              break;
            }

            // Delete groups
            deleted = projectData.groups.filter(function (g) {
              return !groupsUpdate.value.includes(g.id);
            });
            _context8.next = 9;
            return Promise.all(deleted.map( /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(group) {
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return _group["default"].update({
                          id: group.id
                        }, [{
                          key: 'projects',
                          type: 'array',
                          method: 'remove',
                          value: project.id
                        }]);

                      case 2:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x10) {
                return _ref8.apply(this, arguments);
              };
            }()));

          case 9:
            // Added groups
            added = groupsUpdate.value.filter(function (g) {
              return !projectData.groups.find(function (gg) {
                return gg.id === g;
              });
            });
            _context8.next = 12;
            return Promise.all(added.map( /*#__PURE__*/function () {
              var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(group) {
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return _group["default"].update({
                          id: group.id
                        }, [{
                          key: 'projects',
                          type: 'array',
                          method: 'append',
                          value: project.id
                        }]);

                      case 2:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x11) {
                return _ref9.apply(this, arguments);
              };
            }()));

          case 12:
            _context8.next = 14;
            return _project["default"].update(project, data);

          case 14:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function update(_x8, _x9) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Delete project
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { id }
 */


var del = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(_ref10, project) {
    var id, data;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            id = _ref10.id;
            _context11.next = 3;
            return get(project.id, ['groups', 'simulations']);

          case 3:
            data = _context11.sent;

            if (!data.groups) {
              _context11.next = 7;
              break;
            }

            _context11.next = 7;
            return Promise.all(data.groups.map( /*#__PURE__*/function () {
              var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(group) {
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return _group["default"].update({
                          id: group
                        }, [{
                          key: 'projects',
                          type: 'array',
                          method: 'remove',
                          value: project.id
                        }]);

                      case 2:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x14) {
                return _ref12.apply(this, arguments);
              };
            }()));

          case 7:
            if (!data.simulations) {
              _context11.next = 10;
              break;
            }

            _context11.next = 10;
            return Promise.all(data.simulations.map( /*#__PURE__*/function () {
              var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(simulation) {
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return _simulation["default"].del({
                          id: simulation
                        });

                      case 2:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x15) {
                return _ref13.apply(this, arguments);
              };
            }()));

          case 10:
            _context11.next = 12;
            return _project["default"].del(project);

          case 12:
            _context11.next = 14;
            return _workspace["default"].update({
              id: id
            }, [{
              type: 'array',
              method: 'remove',
              key: 'projects',
              value: project.id
            }]);

          case 14:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function del(_x12, _x13) {
    return _ref11.apply(this, arguments);
  };
}();

var Project = {
  add: add,
  get: get,
  update: update,
  del: del
};
var _default = Project;
exports["default"] = _default;