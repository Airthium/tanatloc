"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _crypto = _interopRequireDefault(require("crypto"));

var _organization = _interopRequireDefault(require("../../database/organization"));

var _user = _interopRequireDefault(require("../user"));

var _group = _interopRequireDefault(require("../group"));

var _email = _interopRequireDefault(require("../email"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Add organization
 * @param {Object} user User { id }
 * @param {Object} organization Organization { name }
 */
var add = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user, organization) {
    var newOrganization;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _organization["default"].add({
              name: organization.name,
              owners: [user.id]
            });

          case 2:
            newOrganization = _context.sent;
            _context.next = 5;
            return _user["default"].update(user, [{
              key: 'organizations',
              type: 'array',
              method: 'append',
              value: newOrganization.id
            }]);

          case 5:
            return _context.abrupt("return", newOrganization);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function add(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Get
 * @param {string} id Id
 * @param {Array} data Data
 */


var get = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id, data) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", _organization["default"].get(id, data));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function get(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Get by user
 * @param {Object} user User { id }
 * @param {Array} data Data []
 */


var getByUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(user, data) {
    var internalData, organizations, userOrganizations, returnedOrganization;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            internalData = (0, _toConsumableArray2["default"])(data);
            if (!internalData.includes('owners')) internalData.push('owners');
            if (!internalData.includes('users')) internalData.push('users');
            _context7.next = 5;
            return _organization["default"].getAll(internalData);

          case 5:
            organizations = _context7.sent;
            // Check user
            userOrganizations = organizations.filter(function (o) {
              var _o$owners, _o$users;

              return ((_o$owners = o.owners) === null || _o$owners === void 0 ? void 0 : _o$owners.includes(user.id)) || ((_o$users = o.users) === null || _o$users === void 0 ? void 0 : _o$users.includes(user.id));
            }); // Remove internal

            returnedOrganization = userOrganizations.map(function (o) {
              var organization = {};
              data.forEach(function (d) {
                organization[d] = o[d];
              });
              return organization;
            }); // Users & groups data

            _context7.next = 10;
            return Promise.all(returnedOrganization.map( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(organization) {
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.t0 = organization.owners;

                        if (!_context6.t0) {
                          _context6.next = 5;
                          break;
                        }

                        _context6.next = 4;
                        return Promise.all(organization.owners.map( /*#__PURE__*/function () {
                          var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(o) {
                            var ownerData;
                            return _regenerator["default"].wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return _user["default"].get(o, ['firstname', 'lastname', 'email', 'avatar']);

                                  case 2:
                                    ownerData = _context3.sent;
                                    return _context3.abrupt("return", _objectSpread({
                                      id: o
                                    }, ownerData));

                                  case 4:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function (_x8) {
                            return _ref5.apply(this, arguments);
                          };
                        }()));

                      case 4:
                        organization.owners = _context6.sent;

                      case 5:
                        _context6.t1 = organization.users;

                        if (!_context6.t1) {
                          _context6.next = 10;
                          break;
                        }

                        _context6.next = 9;
                        return Promise.all(organization.users.map( /*#__PURE__*/function () {
                          var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(u) {
                            var userData;
                            return _regenerator["default"].wrap(function _callee4$(_context4) {
                              while (1) {
                                switch (_context4.prev = _context4.next) {
                                  case 0:
                                    _context4.next = 2;
                                    return _user["default"].get(u, ['firstname', 'lastname', 'email', 'avatar']);

                                  case 2:
                                    userData = _context4.sent;
                                    return _context4.abrupt("return", _objectSpread({
                                      id: u
                                    }, userData));

                                  case 4:
                                  case "end":
                                    return _context4.stop();
                                }
                              }
                            }, _callee4);
                          }));

                          return function (_x9) {
                            return _ref6.apply(this, arguments);
                          };
                        }()));

                      case 9:
                        organization.users = _context6.sent;

                      case 10:
                        _context6.t2 = organization.groups;

                        if (!_context6.t2) {
                          _context6.next = 15;
                          break;
                        }

                        _context6.next = 14;
                        return Promise.all(organization.groups.map( /*#__PURE__*/function () {
                          var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(g) {
                            var groupData;
                            return _regenerator["default"].wrap(function _callee5$(_context5) {
                              while (1) {
                                switch (_context5.prev = _context5.next) {
                                  case 0:
                                    _context5.next = 2;
                                    return _group["default"].get(g, ['name', 'users']);

                                  case 2:
                                    groupData = _context5.sent;
                                    return _context5.abrupt("return", _objectSpread({
                                      id: g
                                    }, groupData));

                                  case 4:
                                  case "end":
                                    return _context5.stop();
                                }
                              }
                            }, _callee5);
                          }));

                          return function (_x10) {
                            return _ref7.apply(this, arguments);
                          };
                        }()));

                      case 14:
                        organization.groups = _context6.sent;

                      case 15:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x7) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 10:
            return _context7.abrupt("return", returnedOrganization);

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getByUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Update
 * @param {Object} organization Organization
 * @param {Array} data Data
 * @param {string} ownerId Owner id
 */


var update = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(organization, data, ownerId) {
    var owner, newData;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _user["default"].get(ownerId, ['firstname', 'lastname', 'email']);

          case 2:
            owner = _context9.sent;
            _context9.next = 5;
            return Promise.all(data.map( /*#__PURE__*/function () {
              var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(d) {
                var email, user;
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        if (!(d.type === 'array' && d.method === 'append' && (d.key === 'owners' || d.key === 'users'))) {
                          _context8.next = 17;
                          break;
                        }

                        email = d.value;
                        _context8.next = 4;
                        return _user["default"].getBy(email, ['id'], 'email');

                      case 4:
                        user = _context8.sent;

                        if (!user) {
                          _context8.next = 9;
                          break;
                        }

                        d.value = user.id;
                        _context8.next = 13;
                        break;

                      case 9:
                        _context8.next = 11;
                        return _user["default"].add({
                          email: email,
                          password: _crypto["default"].randomBytes(12).toString('hex')
                        });

                      case 11:
                        user = _context8.sent;
                        d.value = user.id;

                      case 13:
                        _context8.next = 15;
                        return _email["default"].invite(email, owner);

                      case 15:
                        _context8.next = 17;
                        return _user["default"].update({
                          id: user.id
                        }, [{
                          key: 'organizations',
                          type: 'array',
                          method: 'append',
                          value: organization.id
                        }]);

                      case 17:
                        return _context8.abrupt("return", d);

                      case 18:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x14) {
                return _ref9.apply(this, arguments);
              };
            }()));

          case 5:
            newData = _context9.sent;
            _context9.next = 8;
            return _organization["default"].update(organization, newData);

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function update(_x11, _x12, _x13) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * Delete
 * @param {Object} organization Organization { id }
 */


var del = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(organization) {
    var organizationData;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return get(organization.id, ['owners', 'users', 'groups']);

          case 2:
            organizationData = _context13.sent;
            _context13.t0 = organizationData.owners;

            if (!_context13.t0) {
              _context13.next = 7;
              break;
            }

            _context13.next = 7;
            return Promise.all(organizationData.owners.map( /*#__PURE__*/function () {
              var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(owner) {
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return _user["default"].update({
                          id: owner
                        }, [{
                          key: 'organizations',
                          type: 'array',
                          method: 'remove',
                          value: organization.id
                        }]);

                      case 2:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x16) {
                return _ref11.apply(this, arguments);
              };
            }()));

          case 7:
            _context13.t1 = organizationData.users;

            if (!_context13.t1) {
              _context13.next = 11;
              break;
            }

            _context13.next = 11;
            return Promise.all(organizationData.users.map( /*#__PURE__*/function () {
              var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(user) {
                return _regenerator["default"].wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return _user["default"].update({
                          id: user
                        }, [{
                          key: 'organizations',
                          type: 'array',
                          method: 'remove',
                          value: organization.id
                        }]);

                      case 2:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));

              return function (_x17) {
                return _ref12.apply(this, arguments);
              };
            }()));

          case 11:
            _context13.t2 = organizationData.groups;

            if (!_context13.t2) {
              _context13.next = 15;
              break;
            }

            _context13.next = 15;
            return Promise.all(organizationData.groups.map( /*#__PURE__*/function () {
              var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(group) {
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return _group["default"].del(group);

                      case 2:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function (_x18) {
                return _ref13.apply(this, arguments);
              };
            }()));

          case 15:
            _context13.next = 17;
            return _organization["default"].del(organization);

          case 17:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function del(_x15) {
    return _ref10.apply(this, arguments);
  };
}();

var Organization = {
  add: add,
  get: get,
  getByUser: getByUser,
  update: update,
  del: del
};
var _default = Organization;
exports["default"] = _default;