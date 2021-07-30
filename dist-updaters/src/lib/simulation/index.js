"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _storage = _interopRequireDefault(require("../../../config/storage"));

var _api = _interopRequireDefault(require("../../../plugins/api"));

var _simulation = _interopRequireDefault(require("../../database/simulation"));

var _user = _interopRequireDefault(require("../user"));

var _project = _interopRequireDefault(require("../project"));

var _geometry = _interopRequireDefault(require("../geometry"));

var _tools = _interopRequireDefault(require("../tools"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Add simulation
 * @param {Object} Param { project: { id }, simulation: { name, scheme } }
 */
var add = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var project, simulation, simulationData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            project = _ref.project, simulation = _ref.simulation;
            _context.next = 3;
            return _simulation["default"].add(_objectSpread(_objectSpread({}, simulation), {}, {
              project: project.id
            }));

          case 3:
            simulationData = _context.sent;
            _context.next = 6;
            return _project["default"].update(project, [{
              type: 'array',
              method: 'append',
              key: 'simulations',
              value: simulationData.id
            }]);

          case 6:
            return _context.abrupt("return", simulationData);

          case 7:
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
 * Get simulation
 * @param {string} id Simulation's id
 * @param {Array} data Data
 */


var get = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id, data) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", _simulation["default"].get(id, data));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function get(_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Update simulation
 * @param {Object} simulation Simulation { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */


var update = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(simulation, data) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _simulation["default"].update(simulation, data);

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function update(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Delete simulation
 * @param {Object} simulation Simulation { id }
 */


var del = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(simulation) {
    var simulationData, simulationDirectory;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return get(simulation.id, ['project']);

          case 2:
            simulationData = _context4.sent;
            _context4.next = 5;
            return _project["default"].update({
              id: simulationData.project
            }, [{
              type: 'array',
              method: 'remove',
              key: 'simulations',
              value: simulation.id
            }]);

          case 5:
            // Delete folder
            simulationDirectory = _path["default"].join(_storage["default"].SIMULATION, simulation.id);
            _context4.prev = 6;
            _context4.next = 9;
            return _tools["default"].removeDirectory(simulationDirectory);

          case 9:
            _context4.next = 14;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](6);
            console.warn(_context4.t0);

          case 14:
            _context4.next = 16;
            return _simulation["default"].del(simulation);

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[6, 11]]);
  }));

  return function del(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Run simulation
 * @param {Object} user User { id }
 * @param {Object} simulation Simulation { id }
 */


var run = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(user, _ref6) {
    var _userData$authorizedp;

    var id, simulation, configuration, algorithm, plugin, userData, err, geometryId, geometry, type, couplingSimulation, couplingResult, couplingPath;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = _ref6.id;
            _context5.next = 3;
            return get(id, ['scheme']);

          case 3:
            simulation = _context5.sent;
            // Global
            configuration = simulation.scheme.configuration;
            algorithm = simulation.scheme.algorithm; // Update status

            configuration.run = _objectSpread(_objectSpread({}, configuration.run), {}, {
              done: null,
              error: null
            });
            _context5.next = 9;
            return update({
              id: id
            }, [{
              key: 'scheme',
              type: 'json',
              method: 'set',
              path: ['configuration', 'run'],
              value: _objectSpread(_objectSpread({}, configuration.run), {}, {
                done: null,
                error: null
              })
            }]);

          case 9:
            // Find plugin
            plugin = _api["default"][configuration.run.cloudServer.key]; // Check authorized

            _context5.next = 12;
            return _user["default"].get(user.id, ['authorizedplugins']);

          case 12:
            userData = _context5.sent;

            if ((_userData$authorizedp = userData.authorizedplugins) !== null && _userData$authorizedp !== void 0 && _userData$authorizedp.includes(plugin.key)) {
              _context5.next = 19;
              break;
            }

            err = {
              message: 'Unauthorized'
            };
            console.error(err);
            configuration.run = _objectSpread(_objectSpread({}, configuration.run), {}, {
              error: err
            });
            update({
              id: id
            }, [{
              key: 'scheme',
              type: 'json',
              method: 'set',
              path: ['configuration', 'run'],
              value: _objectSpread(_objectSpread({}, configuration.run), {}, {
                error: err
              })
            }]);
            return _context5.abrupt("return");

          case 19:
            // Copy geometry
            geometryId = configuration.geometry.value;
            _context5.next = 22;
            return _geometry["default"].get(geometryId, ['uploadfilename', 'extension']);

          case 22:
            geometry = _context5.sent;
            configuration.geometry.file = geometry.uploadfilename;
            configuration.geometry.name = geometry.uploadfilename.replace('.' + geometry.extension, '');
            configuration.geometry.path = 'geometry';
            _context5.next = 28;
            return _tools["default"].copyFile({
              path: _storage["default"].GEOMETRY,
              file: geometry.uploadfilename
            }, {
              path: _path["default"].join(_storage["default"].SIMULATION, simulation.id, 'geometry'),
              file: geometry.uploadfilename
            });

          case 28:
            if (!(configuration.initialization && configuration.initialization.value)) {
              _context5.next = 43;
              break;
            }

            type = configuration.initialization.value.type;

            if (!(type === 'coupling')) {
              _context5.next = 43;
              break;
            }

            // Get previous mesh and result
            couplingSimulation = configuration.initialization.value.simulation;
            couplingResult = configuration.initialization.value.result;

            if (!(!couplingSimulation || !couplingResult)) {
              _context5.next = 37;
              break;
            }

            configuration.initialization.value = undefined;
            _context5.next = 43;
            break;

          case 37:
            couplingPath = _path["default"].join(_storage["default"].SIMULATION, couplingSimulation, 'run', 'coupling');
            _context5.next = 40;
            return _tools["default"].copyFile({
              path: couplingPath,
              file: couplingResult + '.dat'
            }, {
              path: _path["default"].join(_storage["default"].SIMULATION, simulation.id, 'run', 'coupling'),
              file: 'initialization.dat'
            });

          case 40:
            _context5.next = 42;
            return _tools["default"].copyFile({
              path: couplingPath,
              file: couplingResult + '.mesh'
            }, {
              path: _path["default"].join(_storage["default"].SIMULATION, simulation.id, 'run', 'coupling'),
              file: 'initialization.mesh'
            });

          case 42:
            configuration.initialization.value = {
              type: 'coupling',
              dat: _path["default"].join('run', 'coupling', 'initialization.dat'),
              mesh: _path["default"].join('run', 'coupling', 'initialization.mesh')
            };

          case 43:
            // Compute
            plugin.computeSimulation({
              id: id
            }, algorithm, configuration).then(function () {
              configuration.run = _objectSpread(_objectSpread({}, configuration.run), {}, {
                done: true
              });
              update({
                id: id
              }, [{
                key: 'scheme',
                type: 'json',
                method: 'set',
                path: ['configuration', 'run'],
                value: _objectSpread(_objectSpread({}, configuration.run), {}, {
                  done: true
                })
              }]);
            })["catch"](function (err) {
              console.error(err);
              configuration.run = _objectSpread(_objectSpread({}, configuration.run), {}, {
                error: err
              });
              update({
                id: id
              }, [{
                key: 'scheme',
                type: 'json',
                method: 'set',
                path: ['configuration', 'run'],
                value: _objectSpread(_objectSpread({}, configuration.run), {}, {
                  error: err
                })
              }]);
            });

          case 44:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function run(_x7, _x8) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Stop simulation
 * @param {Object} simulation Simulation { id }
 */


var stop = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref8) {
    var id, simulation, configuration, tasks, plugin;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = _ref8.id;
            _context6.next = 3;
            return get(id, ['scheme', 'tasks']);

          case 3:
            simulation = _context6.sent;
            // Global
            configuration = simulation.scheme.configuration;
            tasks = simulation.tasks; // Find plugin

            plugin = _api["default"][configuration.run.cloudServer.key]; // Stop

            _context6.next = 9;
            return plugin.stop(tasks, configuration);

          case 9:
            // Update tasks
            tasks === null || tasks === void 0 ? void 0 : tasks.forEach(function (task) {
              if (task.status === 'wait') task.status = 'error';
              task.error += 'Job killed';
            });
            _context6.next = 12;
            return update({
              id: id
            }, [{
              key: 'tasks',
              value: tasks
            }]);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function stop(_x9) {
    return _ref9.apply(this, arguments);
  };
}();

var getLog = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_ref10, file) {
    var id, filePath;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = _ref10.id;
            // Path
            filePath = _path["default"].join(_storage["default"].SIMULATION, id, file); // Write file

            return _context7.abrupt("return", _tools["default"].readFile(filePath));

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getLog(_x10, _x11) {
    return _ref11.apply(this, arguments);
  };
}();

var Simulation = {
  add: add,
  get: get,
  update: update,
  del: del,
  run: run,
  stop: stop,
  getLog: getLog
};
var _default = Simulation;
exports["default"] = _default;