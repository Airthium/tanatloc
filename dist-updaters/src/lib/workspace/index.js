"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _workspace = _interopRequireDefault(require("../../database/workspace"));

var _user = _interopRequireDefault(require("../user"));

var _group = _interopRequireDefault(require("../group"));

var _organization = _interopRequireDefault(require("../organization"));

var _project = _interopRequireDefault(require("../project"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Add workspace
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { name }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user, _ref) {
    var name, workspace;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = _ref.name;
            _context.next = 3;
            return _workspace["default"].add(user, {
              name: name
            });

          case 3:
            workspace = _context.sent;
            _context.next = 6;
            return _user["default"].update(user, [{
              type: 'array',
              method: 'append',
              key: 'workspaces',
              value: workspace.id
            }]);

          case 6:
            return _context.abrupt("return", workspace);

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
 * Get workspace
 * @param {string} id Id
 * @param {Array} data Data
 */


var get = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(id, data) {
    var workspace, owners, users, groups;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _workspace["default"].get(id, data);

          case 2:
            workspace = _context5.sent;

            if (!(workspace !== null && workspace !== void 0 && workspace.owners)) {
              _context5.next = 8;
              break;
            }

            _context5.next = 6;
            return Promise.all(workspace.owners.map( /*#__PURE__*/function () {
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

          case 6:
            owners = _context5.sent;
            workspace.owners = owners;

          case 8:
            if (!(workspace !== null && workspace !== void 0 && workspace.users)) {
              _context5.next = 13;
              break;
            }

            _context5.next = 11;
            return Promise.all(workspace.users.map( /*#__PURE__*/function () {
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

          case 11:
            users = _context5.sent;
            workspace.users = users;

          case 13:
            if (!(workspace !== null && workspace !== void 0 && workspace.groups)) {
              _context5.next = 18;
              break;
            }

            _context5.next = 16;
            return Promise.all(workspace.groups.map( /*#__PURE__*/function () {
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

          case 16:
            groups = _context5.sent;
            workspace.groups = groups;

          case 18:
            return _context5.abrupt("return", workspace);

          case 19:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function get(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Get workspaces by user
 * @param {Object} user User { id }
 */


var getByUser = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(_ref7) {
    var id, user, workspaces, localWorkspaces, groupWorkspaces, groupProjects;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            id = _ref7.id;
            _context10.next = 3;
            return _user["default"].get(id, ['firstname', 'lastname', 'email', 'avatar', 'organizations', 'workspaces']);

          case 3:
            user = _context10.sent;
            workspaces = []; // Get local workspaces

            if (!user.workspaces) {
              _context10.next = 10;
              break;
            }

            _context10.next = 8;
            return Promise.all(user.workspaces.map( /*#__PURE__*/function () {
              var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(workspace) {
                var data;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return get(workspace, ['name', 'owners', 'users', 'groups', 'projects']);

                      case 2:
                        data = _context6.sent;
                        return _context6.abrupt("return", _objectSpread({
                          id: workspace
                        }, data));

                      case 4:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x9) {
                return _ref9.apply(this, arguments);
              };
            }()));

          case 8:
            localWorkspaces = _context10.sent;
            workspaces.push.apply(workspaces, (0, _toConsumableArray2["default"])(localWorkspaces));

          case 10:
            if (!user.organizations) {
              _context10.next = 17;
              break;
            }

            groupWorkspaces = [];
            groupProjects = [];
            _context10.next = 15;
            return Promise.all(user.organizations.map( /*#__PURE__*/function () {
              var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(organization) {
                var organizationData;
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return _organization["default"].get(organization, ['groups']);

                      case 2:
                        organizationData = _context9.sent;

                        if (!organizationData.groups) {
                          _context9.next = 6;
                          break;
                        }

                        _context9.next = 6;
                        return Promise.all(organizationData.groups.map( /*#__PURE__*/function () {
                          var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(group) {
                            var groupData;
                            return _regenerator["default"].wrap(function _callee8$(_context8) {
                              while (1) {
                                switch (_context8.prev = _context8.next) {
                                  case 0:
                                    _context8.next = 2;
                                    return _group["default"].get(group, ['name', 'workspaces', 'projects']);

                                  case 2:
                                    groupData = _context8.sent;

                                    if (!groupData.workspaces) {
                                      _context8.next = 6;
                                      break;
                                    }

                                    _context8.next = 6;
                                    return Promise.all(groupData.workspaces.map( /*#__PURE__*/function () {
                                      var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(workspace) {
                                        var _workspaceData$owners;

                                        var workspaceData;
                                        return _regenerator["default"].wrap(function _callee7$(_context7) {
                                          while (1) {
                                            switch (_context7.prev = _context7.next) {
                                              case 0:
                                                _context7.next = 2;
                                                return get(workspace, ['name', 'users', 'owners', 'groups', 'projects']);

                                              case 2:
                                                workspaceData = _context7.sent;
                                                if (!((_workspaceData$owners = workspaceData.owners) !== null && _workspaceData$owners !== void 0 && _workspaceData$owners.find(function (o) {
                                                  return o.id === id;
                                                }))) groupWorkspaces.push(_objectSpread(_objectSpread({
                                                  id: workspace
                                                }, workspaceData), {}, {
                                                  owners: []
                                                }));

                                              case 4:
                                              case "end":
                                                return _context7.stop();
                                            }
                                          }
                                        }, _callee7);
                                      }));

                                      return function (_x12) {
                                        return _ref12.apply(this, arguments);
                                      };
                                    }()));

                                  case 6:
                                    if (groupData.projects) {
                                      groupProjects.push({
                                        id: '0',
                                        name: 'Projects from ' + groupData.name,
                                        owners: [],
                                        groups: [{
                                          id: group,
                                          name: groupData.name
                                        }],
                                        projects: groupData.projects
                                      });
                                    }

                                  case 7:
                                  case "end":
                                    return _context8.stop();
                                }
                              }
                            }, _callee8);
                          }));

                          return function (_x11) {
                            return _ref11.apply(this, arguments);
                          };
                        }()));

                      case 6:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x10) {
                return _ref10.apply(this, arguments);
              };
            }()));

          case 15:
            workspaces.push.apply(workspaces, groupWorkspaces);
            workspaces.push.apply(workspaces, groupProjects);

          case 17:
            return _context10.abrupt("return", workspaces);

          case 18:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function getByUser(_x8) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * Update workspace
 * @param {Object} workspace Workspace { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */


var update = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(workspace, data) {
    var workspaceData, groupsUpdate, deleted, added;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return get(workspace.id, ['groups']);

          case 2:
            workspaceData = _context13.sent;
            if (!workspaceData.groups) workspaceData.groups = []; // Check groups

            groupsUpdate = data.find(function (d) {
              return d.key === 'groups' && !d.type;
            });

            if (!groupsUpdate) {
              _context13.next = 12;
              break;
            }

            // Deleted groups
            deleted = workspaceData.groups.filter(function (g) {
              return !groupsUpdate.value.includes(g.id);
            });
            _context13.next = 9;
            return Promise.all(deleted.map( /*#__PURE__*/function () {
              var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(group) {
                return _regenerator["default"].wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return _group["default"].update({
                          id: group.id
                        }, [{
                          key: 'workspaces',
                          type: 'array',
                          method: 'remove',
                          value: workspace.id
                        }]);

                      case 2:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));

              return function (_x15) {
                return _ref14.apply(this, arguments);
              };
            }()));

          case 9:
            // Added groups
            added = groupsUpdate.value.filter(function (g) {
              return !workspaceData.groups.find(function (gg) {
                return gg.id === g;
              });
            });
            _context13.next = 12;
            return Promise.all(added.map( /*#__PURE__*/function () {
              var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(group) {
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return _group["default"].update({
                          id: group.id
                        }, [{
                          key: 'workspaces',
                          type: 'array',
                          method: 'append',
                          value: workspace.id
                        }]);

                      case 2:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function (_x16) {
                return _ref15.apply(this, arguments);
              };
            }()));

          case 12:
            _context13.next = 14;
            return _workspace["default"].update(workspace, data);

          case 14:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function update(_x13, _x14) {
    return _ref13.apply(this, arguments);
  };
}();
/**
 *
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { id }
 */


var del = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(user, workspace) {
    var data;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return get(workspace.id, ['groups', 'projects']);

          case 2:
            data = _context16.sent;

            if (!data.groups) {
              _context16.next = 6;
              break;
            }

            _context16.next = 6;
            return Promise.all(data.groups.map( /*#__PURE__*/function () {
              var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(group) {
                return _regenerator["default"].wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return _group["default"].update({
                          id: group.id
                        }, [{
                          key: 'workspaces',
                          type: 'array',
                          method: 'remove',
                          vale: workspace.id
                        }]);

                      case 2:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              }));

              return function (_x19) {
                return _ref17.apply(this, arguments);
              };
            }()));

          case 6:
            if (!data.projects) {
              _context16.next = 9;
              break;
            }

            _context16.next = 9;
            return Promise.all(data.projects.map( /*#__PURE__*/function () {
              var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(project) {
                return _regenerator["default"].wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.next = 2;
                        return _project["default"].del(workspace, {
                          id: project
                        });

                      case 2:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15);
              }));

              return function (_x20) {
                return _ref18.apply(this, arguments);
              };
            }()));

          case 9:
            _context16.next = 11;
            return _workspace["default"].del(workspace);

          case 11:
            _context16.next = 13;
            return _user["default"].update(user, [{
              type: 'array',
              method: 'remove',
              key: 'workspaces',
              value: workspace.id
            }]);

          case 13:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function del(_x17, _x18) {
    return _ref16.apply(this, arguments);
  };
}();

var Workspace = {
  add: add,
  get: get,
  getByUser: getByUser,
  update: update,
  del: del
};
var _default = Workspace;
exports["default"] = _default;