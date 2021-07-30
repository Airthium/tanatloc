"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = _interopRequireDefault(require("../src/lib/user"));

var _plugin = _interopRequireDefault(require("../src/lib/plugin"));

console.info('Rescale plugin update...'); // Add Rescale walltime

var addRescaleWalltime = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var users;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _user["default"].getAll(['id', 'plugins']);

          case 2:
            users = _context3.sent;
            _context3.next = 5;
            return Promise.all(users.map( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(user) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!user.plugins) {
                          _context2.next = 3;
                          break;
                        }

                        _context2.next = 3;
                        return Promise.all(user.plugins.map( /*#__PURE__*/function () {
                          var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(plugin) {
                            var needUpdate;
                            return _regenerator["default"].wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    if (!(plugin.key === 'rescale')) {
                                      _context.next = 10;
                                      break;
                                    }

                                    needUpdate = false;

                                    if (!plugin.data.walltime) {
                                      plugin.data.walltime = 48;
                                      needUpdate = true;
                                    } // if (!plugin.configuration.walltime) {


                                    // if (!plugin.configuration.walltime) {
                                    plugin.configuration.walltime = {
                                      label: 'Default walltime (hours)',
                                      type: 'input',
                                      "default": '48',
                                      value: '48'
                                    };
                                    needUpdate = true; // }

                                    // }
                                    if (!plugin.inUseConfiguration.walltime) {
                                      plugin.inUseConfiguration.walltime = {
                                        label: 'Walltime'
                                      };
                                      needUpdate = true;
                                    }

                                    if (!needUpdate) {
                                      _context.next = 10;
                                      break;
                                    }

                                    _context.next = 9;
                                    return _plugin["default"].update({
                                      id: user.id
                                    }, plugin);

                                  case 9:
                                    console.info('Plugin updated');

                                  case 10:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x2) {
                            return _ref3.apply(this, arguments);
                          };
                        }()));

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function addRescaleWalltime() {
    return _ref.apply(this, arguments);
  };
}();

addRescaleWalltime().then(function () {
  return console.info('ok');
})["catch"](function (err) {
  return console.error(err);
});