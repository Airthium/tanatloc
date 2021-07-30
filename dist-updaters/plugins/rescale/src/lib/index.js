"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _storage = _interopRequireDefault(require("../../../../config/storage"));

var _template = _interopRequireDefault(require("../../../../src/lib/template"));

var _tools = _interopRequireDefault(require("../../../../src/lib/tools"));

var _call = _interopRequireDefault(require("./call"));

var _tools2 = require("./tools");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Plugin key
var key = 'rescale'; // dB update delay

var updateDelay = 1000; // ms
// Log file name

var logFileName = 'process_log.log';
var processFileName = 'process_data.log';
/**
 * Initialization
 * @param {Object} configuration Configuration
 */

var init = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(configuration) {
    var coreTypes, freefem;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'coretypes/?page_size=50'
            });

          case 2:
            coreTypes = _context.sent;

            if (!(coreTypes.detail === 'Invalid token.')) {
              _context.next = 5;
              break;
            }

            throw new Error(coreTypes.detail);

          case 5:
            _context.next = 7;
            return (0, _tools2.checkFiles)(configuration);

          case 7:
            _context.next = 9;
            return (0, _tools2.getFreeFEM)(configuration);

          case 9:
            freefem = _context.sent;
            return _context.abrupt("return", {
              data: {
                coreTypes: coreTypes.results,
                freefem: freefem,
                walltime: configuration.walltime.value
              }
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function init(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Compute simulation
 * @param {Object} simulation Simulation { id }
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 */


var computeSimulation = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref2, algorithm, configuration) {
    var id, simulationPath, couplingPath, resultPath, dataPath, tasks, simulationTask;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = _ref2.id;
            // Path
            simulationPath = _path["default"].join(_storage["default"].SIMULATION, id);
            couplingPath = 'coupling';
            resultPath = 'result';
            dataPath = 'data'; // Create tasks

            tasks = [];
            simulationTask = {
              index: 0,
              label: 'Rescale',
              log: '',
              warning: '',
              error: '',
              status: 'wait'
            };
            tasks.push(simulationTask);
            (0, _tools2.updateTasks)(id, tasks);
            _context4.prev = 9;
            return _context4.delegateYield( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
              var _configuration$initia, _configuration$initia2;

              var customLogFileName, cloudConfiguration, cloudParameters, command, geometryFiles, geometries, couplings, gmshScripts, meshes, edp, numberOfCores, jobId, status, currentLog, results, datas, inRunFiles, logFile, log, processFile, _log, files, _logFile, _log2, _processFile, _log3;

              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      // Cloud configuration
                      customLogFileName = configuration.run.logFile;
                      cloudConfiguration = configuration.run.cloudServer.configuration;
                      cloudParameters = configuration.run.cloudServer.inUseConfiguration; // Result & data directories

                      _context3.next = 5;
                      return _tools["default"].createPath(_path["default"].join(simulationPath, 'run', couplingPath));

                    case 5:
                      _context3.next = 7;
                      return _tools["default"].createPath(_path["default"].join(simulationPath, 'run', resultPath));

                    case 7:
                      _context3.next = 9;
                      return _tools["default"].createPath(_path["default"].join(simulationPath, 'run', dataPath));

                    case 9:
                      // Command
                      command = 'mkdir -p coupling && mkdir -p result && mkdir -p data '; // Upload geometries

                      simulationTask.log += 'Uploading geometry...\n';
                      (0, _tools2.updateTasks)(id, tasks);
                      geometryFiles = Object.keys(configuration).map(function (ckey) {
                        if (configuration[ckey].meshable !== undefined) {
                          var geometry = configuration[ckey];
                          return {
                            name: geometry.name,
                            path: _path["default"].join(_storage["default"].SIMULATION, id, geometry.path, geometry.file)
                          };
                        }
                      });
                      _context3.next = 15;
                      return (0, _tools2.uploadFiles)(cloudConfiguration, geometryFiles.filter(function (f) {
                        return f;
                      }), simulationTask);

                    case 15:
                      geometries = _context3.sent;
                      simulationTask.log += '\n';
                      (0, _tools2.updateTasks)(id, tasks); // Upload coupling data

                      couplings = [];

                      if (!(((_configuration$initia = configuration.initialization) === null || _configuration$initia === void 0 ? void 0 : (_configuration$initia2 = _configuration$initia.value) === null || _configuration$initia2 === void 0 ? void 0 : _configuration$initia2.type) === 'coupling')) {
                        _context3.next = 28;
                        break;
                      }

                      simulationTask.log += 'Uploading coupling data...\n';
                      (0, _tools2.updateTasks)(id, tasks);
                      _context3.next = 24;
                      return (0, _tools2.uploadFiles)(cloudConfiguration, [{
                        name: 'initialization data',
                        path: _path["default"].join(simulationPath, configuration.initialization.value.dat)
                      }, {
                        name: 'initialization mesh',
                        path: _path["default"].join(simulationPath, configuration.initialization.value.mesh)
                      }], simulationTask);

                    case 24:
                      couplings = _context3.sent;
                      configuration.initialization.value = {
                        type: 'coupling',
                        dat: 'initialization.dat',
                        mesh: 'initialization.mesh'
                      };
                      simulationTask.log += '\n';
                      (0, _tools2.updateTasks)(id, tasks);

                    case 28:
                      // Gmsh scripts
                      simulationTask.log += 'Build meshing scripts...\n';
                      (0, _tools2.updateTasks)(id, tasks);
                      _context3.next = 32;
                      return Promise.all(Object.keys(configuration).map( /*#__PURE__*/function () {
                        var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ckey) {
                          var _configuration$initia3, _configuration$initia4, geometry, geoFile, meshFile, meshPath, partPath, refinements, parameters, mesh;

                          return _regenerator["default"].wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  if (!configuration[ckey].meshable) {
                                    _context2.next = 22;
                                    break;
                                  }

                                  if (!(((_configuration$initia3 = configuration.initialization) === null || _configuration$initia3 === void 0 ? void 0 : (_configuration$initia4 = _configuration$initia3.value) === null || _configuration$initia4 === void 0 ? void 0 : _configuration$initia4.type) === 'coupling')) {
                                    _context2.next = 6;
                                    break;
                                  }

                                  configuration[ckey].mesh = {};
                                  return _context2.abrupt("return", null);

                                case 6:
                                  geometry = configuration[ckey];
                                  geoFile = geometry.name + '.geo';
                                  meshFile = geometry.name + '.msh';
                                  meshPath = geometry.name + '_mesh';
                                  partPath = geometry.name; // Task

                                  // Task
                                  simulationTask.log += ' - ' + geoFile + '\n';
                                  (0, _tools2.updateTasks)(id, tasks); // Check refinements

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
                                  }; // Render template

                                  _context2.next = 18;
                                  return _template["default"].render('gmsh3D', _objectSpread(_objectSpread({}, parameters), {}, {
                                    geometry: geometry.file
                                  }), {
                                    location: _path["default"].join(simulationPath, meshPath),
                                    name: geoFile
                                  });

                                case 18:
                                  // Update command
                                  command += '&& gmsh -3 ' + geoFile + ' -o ' + meshFile + ' -format msh2 -clcurv 10 '; // Update configuration

                                  // Update configuration
                                  mesh = {
                                    fileName: meshFile,
                                    originPath: 'geometry_mesh',
                                    renderPath: '.',
                                    part: 'part.json',
                                    partPath: _path["default"].join(meshPath, partPath)
                                  };
                                  configuration[ckey].mesh = mesh;
                                  return _context2.abrupt("return", {
                                    name: geoFile,
                                    path: _path["default"].join(_storage["default"].SIMULATION, id, meshPath, geoFile)
                                  });

                                case 22:
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

                    case 32:
                      gmshScripts = _context3.sent;
                      simulationTask.log += '\n';
                      (0, _tools2.updateTasks)(id, tasks); // Upload gmsh scripts

                      simulationTask.log += 'Uploading Gmsh scripts...\n';
                      (0, _tools2.updateTasks)(id, tasks);
                      _context3.next = 39;
                      return (0, _tools2.uploadFiles)(cloudConfiguration, gmshScripts.filter(function (f) {
                        return f;
                      }), simulationTask);

                    case 39:
                      meshes = _context3.sent;
                      simulationTask.log += '\n';
                      (0, _tools2.updateTasks)(id, tasks); // Build the FreeFEM script

                      simulationTask.log += 'Build FreeFEM script...\n';
                      (0, _tools2.updateTasks)(id, tasks);
                      _context3.next = 46;
                      return _template["default"].render(algorithm, _objectSpread(_objectSpread({}, configuration), {}, {
                        dimension: 3,
                        run: _objectSpread(_objectSpread({}, configuration.run), {}, {
                          couplingPath: 'coupling',
                          resultPath: 'result',
                          dataPath: 'data'
                        })
                      }), {
                        location: _path["default"].join(simulationPath, 'run'),
                        name: id + '.edp'
                      });

                    case 46:
                      simulationTask.log += '\n';
                      (0, _tools2.updateTasks)(id, tasks); // Upload FreeFEM script

                      simulationTask.log += 'Uploading FreeFEM script...\n';
                      (0, _tools2.updateTasks)(id, tasks);
                      _context3.next = 52;
                      return (0, _tools2.uploadFile)(cloudConfiguration, _path["default"].join(_storage["default"].SIMULATION, id, 'run', id + '.edp'));

                    case 52:
                      edp = _context3.sent;
                      simulationTask.log += '\n';
                      (0, _tools2.updateTasks)(id, tasks); // Update command

                      numberOfCores = cloudParameters.numberOfCores.value;
                      command += '&& mpirun -np ' + numberOfCores + ' FreeFem++-mpi -ns ' + edp.name; // Create job

                      simulationTask.log += 'Create job...\n';
                      (0, _tools2.updateTasks)(id, tasks);
                      _context3.next = 61;
                      return (0, _tools2.createJob)(id, algorithm, cloudConfiguration, cloudParameters, command, geometries, couplings, meshes, edp);

                    case 61:
                      jobId = _context3.sent;

                      if (jobId.error) {
                        simulationTask.error += ' Fatal error: ' + JSON.stringify(jobId) + '\n';
                        (0, _tools2.updateTasks)(id, tasks);
                      }

                      simulationTask.log += ' - Job id: ' + jobId + '\n';
                      (0, _tools2.updateTasks)(id, tasks); // Submit job

                      simulationTask.log += 'Submit job...\n';
                      simulationTask.pid = jobId;
                      (0, _tools2.updateTasks)(id, tasks);
                      _context3.next = 70;
                      return (0, _tools2.submitJob)(cloudConfiguration, jobId);

                    case 70:
                      simulationTask.log += '\n';
                      (0, _tools2.updateTasks)(id, tasks); // Waiting for start

                      simulationTask.log += 'Starting cluster...\n';
                      (0, _tools2.updateTasks)(id, tasks); // Monitoring

                      currentLog = simulationTask.log;
                      results = [];
                      datas = [];
                      couplings = [];

                    case 78:
                      if (!(status !== 'Completed')) {
                        _context3.next = 125;
                        break;
                      }

                      _context3.next = 81;
                      return (0, _tools2.getStatus)(cloudConfiguration, jobId);

                    case 81:
                      status = _context3.sent;

                      if (!(status === 'Executing')) {
                        _context3.next = 102;
                        break;
                      }

                      _context3.next = 85;
                      return (0, _tools2.getInRunFiles)(cloudConfiguration, jobId);

                    case 85:
                      inRunFiles = _context3.sent;
                      // Log
                      logFile = inRunFiles.find(function (f) {
                        return f.path.includes(customLogFileName || logFileName);
                      });

                      if (!logFile) {
                        _context3.next = 92;
                        break;
                      }

                      _context3.next = 90;
                      return (0, _tools2.getInRunFile)(cloudConfiguration, logFile);

                    case 90:
                      log = _context3.sent;

                      if (typeof log === 'string') {
                        // Log
                        simulationTask.log = currentLog + log.replace(/\[.*\]: /g, '');
                      }

                    case 92:
                      // TODO get coupling data
                      // Results / data
                      processFile = inRunFiles.find(function (f) {
                        return f.path.includes(processFileName);
                      });

                      if (!processFile) {
                        _context3.next = 100;
                        break;
                      }

                      _context3.next = 96;
                      return (0, _tools2.getInRunFile)(cloudConfiguration, processFile);

                    case 96:
                      _log = _context3.sent;

                      if (!(typeof _log === 'string')) {
                        _context3.next = 100;
                        break;
                      }

                      _context3.next = 100;
                      return (0, _tools2.getInRunOutputs)(cloudConfiguration, _log, inRunFiles, results, datas, couplings, simulationPath, _path["default"].join('run', resultPath), _path["default"].join('run', dataPath), _path["default"].join('run', couplingPath), simulationTask);

                    case 100:
                      _context3.next = 120;
                      break;

                    case 102:
                      if (!(status === 'Completed')) {
                        _context3.next = 120;
                        break;
                      }

                      _context3.next = 105;
                      return (0, _tools2.getFiles)(cloudConfiguration, jobId);

                    case 105:
                      files = _context3.sent;
                      // Log
                      _logFile = files.find(function (f) {
                        return f.relativePath.includes(customLogFileName || logFileName);
                      });

                      if (!_logFile) {
                        _context3.next = 112;
                        break;
                      }

                      _context3.next = 110;
                      return (0, _tools2.getFile)(cloudConfiguration, _logFile.id);

                    case 110:
                      _log2 = _context3.sent;

                      if (typeof _log2 === 'string') {
                        // Log
                        simulationTask.log = currentLog + _log2.replace(/\[.*\]: /g, '');
                      }

                    case 112:
                      // Results / data
                      _processFile = files.find(function (f) {
                        return f.relativePath.includes(processFileName);
                      });

                      if (!_processFile) {
                        _context3.next = 120;
                        break;
                      }

                      _context3.next = 116;
                      return (0, _tools2.getFile)(cloudConfiguration, _processFile.id);

                    case 116:
                      _log3 = _context3.sent;

                      if (!(typeof _log3 === 'string')) {
                        _context3.next = 120;
                        break;
                      }

                      _context3.next = 120;
                      return (0, _tools2.getOutputs)(cloudConfiguration, _log3, files, results, datas, couplings, simulationPath, _path["default"].join('run', resultPath), _path["default"].join('run', dataPath), _path["default"].join('run', couplingPath), simulationTask);

                    case 120:
                      // Task
                      (0, _tools2.updateTasks)(id, tasks); // Wait

                      _context3.next = 123;
                      return new Promise(function (resolve) {
                        setTimeout(resolve, updateDelay);
                      });

                    case 123:
                      _context3.next = 78;
                      break;

                    case 125:
                      // Task
                      simulationTask.status = 'finish';
                      (0, _tools2.updateTasks)(id, tasks);

                    case 127:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })(), "t0", 11);

          case 11:
            _context4.next = 19;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t1 = _context4["catch"](9);
            // Task
            simulationTask.status = 'error';
            simulationTask.error += 'Fatal error: ' + _context4.t1.message;
            (0, _tools2.updateTasks)(id, tasks);
            throw _context4.t1;

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[9, 13]]);
  }));

  return function computeSimulation(_x2, _x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Stop simulation
 * @param {Array} tasks Tasks
 * @param {Object} configuration Configuration
 */


var stop = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(tasks, configuration) {
    var cloudConfiguration;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            cloudConfiguration = configuration.run.cloudServer.configuration;
            _context6.next = 3;
            return Promise.all(tasks.map( /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(task) {
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (!(task.status === 'wait' || task.status === 'process')) {
                          _context5.next = 5;
                          break;
                        }

                        _context5.next = 3;
                        return (0, _call["default"])({
                          platform: cloudConfiguration.platform.value,
                          token: cloudConfiguration.token.value,
                          method: 'POST',
                          route: 'jobs/' + task.pid + '/run/1/stop/'
                        });

                      case 3:
                        _context5.next = 5;
                        return (0, _call["default"])({
                          platform: cloudConfiguration.platform.value,
                          token: cloudConfiguration.token.value,
                          method: 'POST',
                          route: 'jobs/' + task.pid + '/stop/'
                        });

                      case 5:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x8) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function stop(_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}();

var _default = {
  key: key,
  init: init,
  computeSimulation: computeSimulation,
  stop: stop
};
exports["default"] = _default;