"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fixed = require("set-interval-async/fixed");

var _setIntervalAsync = require("set-interval-async");

var _storage = _interopRequireDefault(require("../../../../config/storage"));

var _simulation = _interopRequireDefault(require("../../../../src/database/simulation"));

var _services = _interopRequireDefault(require("../../../../src/services"));

var _tools = _interopRequireDefault(require("../../../../src/lib/tools"));

var _template = _interopRequireDefault(require("../../../../src/lib/template"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Plugin key
var key = 'local'; // dB update delay

var updateDelay = 1000; // ms
// Results / data file name

var logFileName = 'process_log.log';
var processFileName = 'process_data.log';
/**
 * Update tasks
 * @param {string} id Id
 * @param {Array} tasks Tasks
 */

var updateTasks = function updateTasks(id, tasks) {
  _simulation["default"].update({
    id: id
  }, [{
    key: 'tasks',
    value: tasks
  }]);
};
/**
 * Compute mesh
 * @param {string} simulationPath Simulation path
 * @param {Object} geometry Geometry
 * @param {Object} mesh Mesh
 */


var computeMesh = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(simulationPath, geometry, mesh, callback) {
    var geoFile, mshFile, partPath, code, three;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            geoFile = geometry.name + '.geo';
            mshFile = geometry.name + '.msh';
            partPath = geometry.name; // Render template

            _context.next = 5;
            return _template["default"].render('gmsh3D', _objectSpread(_objectSpread({}, mesh.parameters), {}, {
              geometry: _path["default"].join('..', geometry.path, geometry.file)
            }), {
              location: _path["default"].join(simulationPath, mesh.path),
              name: geoFile
            });

          case 5:
            _context.next = 7;
            return _services["default"].gmsh(simulationPath, _path["default"].join(mesh.path, geoFile), _path["default"].join(mesh.path, mshFile), callback);

          case 7:
            code = _context.sent;

            if (!(code !== 0)) {
              _context.next = 10;
              break;
            }

            throw new Error('Meshing process failed. Code ' + code);

          case 10:
            _context.next = 12;
            return _tools["default"].convert(_path["default"].join(simulationPath, mesh.path), {
              name: mshFile,
              target: partPath
            }, function (_ref2) {
              var data = _ref2.data,
                  error = _ref2.error;
              return callback({
                data: data,
                error: error
              });
            });

          case 12:
            three = _context.sent;
            return _context.abrupt("return", {
              type: 'mesh',
              fileName: mshFile,
              originPath: mesh.path,
              renderPath: mesh.path,
              json: three.json,
              glb: three.glb
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function computeMesh(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Compute simulation
 * @param {string} simulation Simulation { id }
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 */


var computeSimulation = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref3, algorithm, configuration) {
    var id, start, simulationPath, tasks, taskIndex, simulationTask, code;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = _ref3.id;
            // Time
            start = Date.now(); // Path

            simulationPath = _path["default"].join(_storage["default"].SIMULATION, id); // Create tasks

            tasks = [];
            taskIndex = 0; // Meshing

            _context4.next = 7;
            return Promise.all(Object.keys(configuration).map( /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ckey) {
                var _configuration$initia, _configuration$initia2, geometry, meshingTask, refinements, parameters, mesh;

                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!configuration[ckey].meshable) {
                          _context2.next = 31;
                          break;
                        }

                        geometry = configuration[ckey]; // Task

                        // Task
                        meshingTask = {
                          index: taskIndex++,
                          label: 'Mesh',
                          log: '',
                          warning: '',
                          error: '',
                          status: 'wait'
                        };
                        tasks.push(meshingTask);
                        updateTasks(id, tasks);

                        if (!(((_configuration$initia = configuration.initialization) === null || _configuration$initia === void 0 ? void 0 : (_configuration$initia2 = _configuration$initia.value) === null || _configuration$initia2 === void 0 ? void 0 : _configuration$initia2.type) === 'coupling')) {
                          _context2.next = 12;
                          break;
                        }

                        // Build not needed
                        configuration[ckey].mesh = {};
                        meshingTask.log += 'Coupling: skip mesh build';
                        meshingTask.status = 'finish';
                        updateTasks(id, tasks);
                        _context2.next = 31;
                        break;

                      case 12:
                        // Check refinements
                        refinements = [];
                        configuration.boundaryConditions && Object.keys(configuration.boundaryConditions).forEach(function (boundaryKey) {
                          if (boundaryKey === 'index' || boundaryKey === 'title' || boundaryKey === 'done') return;
                          var boundaryCondition = configuration.boundaryConditions[boundaryKey];

                          if (boundaryCondition.values && boundaryCondition.refineFactor) {
                            refinements.push({
                              size: 'factor',
                              factor: boundaryCondition.refineFactor,
                              selected: boundaryCondition.values.flatMap(function (v) {
                                return v.selected;
                              })
                            });
                          }
                        }); // Mesh parameters

                        // Mesh parameters
                        parameters = {
                          size: 'auto',
                          fineness: 'normal',
                          refinements: refinements
                        }; // Build mesh

                        _context2.prev = 15;
                        _context2.next = 18;
                        return computeMesh(simulationPath, {
                          path: _path["default"].join(geometry.path),
                          file: geometry.file,
                          name: geometry.name
                        }, {
                          path: _path["default"].join(geometry.name + '_mesh'),
                          parameters: parameters
                        }, function (_ref6) {
                          var pid = _ref6.pid,
                              error = _ref6.error,
                              data = _ref6.data;
                          meshingTask.status = 'process';
                          pid && (meshingTask.pid = pid);
                          error && (meshingTask.error += 'Error: ' + error + '\n');
                          data && (meshingTask.log += data + '\n');
                          if ((Date.now() - start) % updateDelay === 0) updateTasks(id, tasks);
                        });

                      case 18:
                        mesh = _context2.sent;
                        // Task
                        meshingTask.status = 'finish';
                        meshingTask.file = mesh;
                        updateTasks(id, tasks); // Save mesh name

                        // Save mesh name
                        configuration[ckey].mesh = mesh;
                        _context2.next = 31;
                        break;

                      case 25:
                        _context2.prev = 25;
                        _context2.t0 = _context2["catch"](15);
                        // Task
                        meshingTask.status = 'error';
                        meshingTask.error += 'Fatal error: ' + _context2.t0.message;
                        updateTasks(id, tasks);
                        throw _context2.t0;

                      case 31:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[15, 25]]);
              }));

              return function (_x8) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 7:
            simulationTask = {
              index: taskIndex++,
              label: 'Simulation',
              log: '',
              warning: '',
              error: '',
              status: 'wait',
              systemLog: 'log'
            };
            tasks.push(simulationTask);
            updateTasks(id, tasks);
            _context4.prev = 10;
            _context4.next = 13;
            return _template["default"].render(algorithm, _objectSpread(_objectSpread({}, configuration), {}, {
              dimension: 3,
              run: _objectSpread(_objectSpread({}, configuration.run), {}, {
                couplingPath: 'run/coupling',
                resultPath: 'run/result',
                dataPath: 'run/data'
              })
            }), {
              location: _path["default"].join(simulationPath, 'run'),
              name: id + '.edp'
            });

          case 13:
            _context4.next = 15;
            return _tools["default"].createPath(_path["default"].join(simulationPath, 'run/coupling'));

          case 15:
            _context4.next = 17;
            return _tools["default"].createPath(_path["default"].join(simulationPath, 'run/result'));

          case 17:
            _context4.next = 19;
            return _tools["default"].createPath(_path["default"].join(simulationPath, 'run/data'));

          case 19:
            _context4.next = 21;
            return _services["default"].freefem(simulationPath, _path["default"].join('run', id + '.edp'), /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref7) {
                var pid, error;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        pid = _ref7.pid, error = _ref7.error;
                        simulationTask.status = 'process';
                        startProcess(simulationPath, simulationTask, function () {
                          return updateTasks(id, tasks);
                        });
                        pid && (simulationTask.pid = pid);
                        error && (simulationTask.error += 'Error: ' + error + '\n');
                        if ((Date.now() - start) % updateDelay === 0) updateTasks(id, tasks);

                      case 6:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x9) {
                return _ref8.apply(this, arguments);
              };
            }());

          case 21:
            code = _context4.sent;
            _context4.next = 24;
            return stopProcess(simulationPath, simulationTask, function () {
              return updateTasks(id, tasks);
            });

          case 24:
            // Task
            simulationTask.status = 'finish';
            updateTasks(id, tasks); // check code

            if (!(code !== 0)) {
              _context4.next = 28;
              break;
            }

            throw new Error('Simulating process failed. Code ' + code);

          case 28:
            _context4.next = 36;
            break;

          case 30:
            _context4.prev = 30;
            _context4.t0 = _context4["catch"](10);
            // Task
            simulationTask.status = 'error';
            simulationTask.error += 'Fatal error: ' + _context4.t0.message;
            updateTasks(id, tasks);
            throw _context4.t0;

          case 36:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[10, 30]]);
  }));

  return function computeSimulation(_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var interval = null;
var results = [];
var datas = [];
/**
 * Start process results & datas
 * @param {string} simulationPath Simulation path
 * @param {Object} task Simulation task
 * @param {Function} update Update task
 */

var startProcess = function startProcess(simulationPath, task, update) {
  if (!interval) {
    results.length = 0;
    datas.length = 0;
    interval = (0, _fixed.setIntervalAsync)( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", processOutput(simulationPath, task, update));

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })), 1000);
  }
};
/**
 * Stop process results and datas
 */


var stopProcess = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(simulationPath, task, update) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            interval && (0, _setIntervalAsync.clearIntervalAsync)(interval);
            _context6.next = 3;
            return processOutput(simulationPath, task, update);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function stopProcess(_x10, _x11, _x12) {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * Process results & datas
 * @param {string} simulationPath Simulation path
 * @param {Object} task Simulation task
 * @param {Function} update Update task
 */


var processOutput = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(simulationPath, task, update) {
    var log, _process, lines, resultLines, dataLines;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return _tools["default"].readFile(_path["default"].join(simulationPath, logFileName));

          case 3:
            log = _context9.sent;
            log && (task.log = log.toString());
            _context9.next = 10;
            break;

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](0);
            console.warn(_context9.t0);

          case 10:
            _context9.prev = 10;
            _context9.next = 13;
            return _tools["default"].readFile(_path["default"].join(simulationPath, processFileName));

          case 13:
            _process = _context9.sent;
            lines = _process.toString().split('\n');
            resultLines = lines.filter(function (l) {
              return l.includes('PROCESS VTU FILE');
            });
            dataLines = lines.filter(function (l) {
              return l.includes('PROCESS DATA FILE');
            }); // Get result

            _context9.next = 19;
            return Promise.all(resultLines.map( /*#__PURE__*/function () {
              var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(line) {
                var resFile, partPath, convertData, convertError, _convertData, _convertData$trim, newResults;

                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        if (!results.includes(line)) {
                          _context7.next = 2;
                          break;
                        }

                        return _context7.abrupt("return");

                      case 2:
                        // New result
                        resFile = line.replace('PROCESS VTU FILE', '').trim();
                        partPath = resFile.replace('.vtu', '');
                        _context7.prev = 4;
                        // Convert
                        convertData = '';
                        convertError = '';
                        _context7.next = 9;
                        return _tools["default"].convert(_path["default"].join(simulationPath, 'run', 'result'), {
                          name: resFile,
                          target: partPath
                        }, function (_ref13) {
                          var data = _ref13.data,
                              error = _ref13.error;
                          data && (convertData += data);
                          error && (convertError += error);
                        }, {
                          isResult: true
                        });

                      case 9:
                        if (convertError) {
                          task.warning += 'Warning: Result converting process failed (' + convertError + ')\n';
                          update();
                        } else {
                          // Add to task
                          newResults = (_convertData = convertData) === null || _convertData === void 0 ? void 0 : (_convertData$trim = _convertData.trim()) === null || _convertData$trim === void 0 ? void 0 : _convertData$trim.split('\n').map(function (res) {
                            return JSON.parse(res);
                          });
                          task.files = [].concat((0, _toConsumableArray2["default"])(task.files || []), (0, _toConsumableArray2["default"])(newResults.map(function (result) {
                            return {
                              type: 'result',
                              fileName: resFile,
                              originPath: 'run/result',
                              name: result.name,
                              json: result.path,
                              glb: result.path + '.glb'
                            };
                          })));
                          update(); // Add to results

                          // Add to results
                          results.push(line);
                        }

                        _context7.next = 17;
                        break;

                      case 12:
                        _context7.prev = 12;
                        _context7.t0 = _context7["catch"](4);
                        console.error(_context7.t0);
                        task.warning += 'Warning: Unable to convert result file (' + _context7.t0.message + ')\n';
                        update();

                      case 17:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7, null, [[4, 12]]);
              }));

              return function (_x16) {
                return _ref12.apply(this, arguments);
              };
            }()));

          case 19:
            _context9.next = 21;
            return Promise.all(dataLines.map( /*#__PURE__*/function () {
              var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(line) {
                var dataFile, dataPath, dataContent;
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        if (!datas.includes(line)) {
                          _context8.next = 2;
                          break;
                        }

                        return _context8.abrupt("return");

                      case 2:
                        // New data
                        dataFile = line.replace('PROCESS DATA FILE', '').trim();
                        _context8.prev = 3;
                        // Read file
                        dataPath = _path["default"].join(simulationPath, 'run', 'data', dataFile);
                        _context8.next = 7;
                        return _tools["default"].readFile(dataPath);

                      case 7:
                        dataContent = _context8.sent;
                        // Add to tasks
                        task.datas = [].concat((0, _toConsumableArray2["default"])(task.datas || []), [JSON.parse(dataContent.toString())]);
                        update(); // Add to datas

                        // Add to datas
                        datas.push(line);
                        _context8.next = 17;
                        break;

                      case 13:
                        _context8.prev = 13;
                        _context8.t0 = _context8["catch"](3);
                        task.warning += 'Warning: Unable to read data file (' + _context8.t0.message + ')\n';
                        update();

                      case 17:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8, null, [[3, 13]]);
              }));

              return function (_x17) {
                return _ref14.apply(this, arguments);
              };
            }()));

          case 21:
            _context9.next = 26;
            break;

          case 23:
            _context9.prev = 23;
            _context9.t1 = _context9["catch"](10);
            console.warn(_context9.t1);

          case 26:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 7], [10, 23]]);
  }));

  return function processOutput(_x13, _x14, _x15) {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * Stop tasks
 * @param {Array} tasks Tasks
 */


var stop = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(tasks) {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            tasks === null || tasks === void 0 ? void 0 : tasks.forEach(function (task) {
              if (task.status === 'process') process.kill(task.pid);
            });

          case 1:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function stop(_x18) {
    return _ref15.apply(this, arguments);
  };
}();

var _default = {
  key: key,
  computeMesh: computeMesh,
  computeSimulation: computeSimulation,
  stop: stop
};
exports["default"] = _default;