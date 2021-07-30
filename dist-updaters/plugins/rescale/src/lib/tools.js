"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOutputs = exports.getInRunOutputs = exports.getFile = exports.getFiles = exports.getInRunFile = exports.getInRunFiles = exports.getStatus = exports.submitJob = exports.createJob = exports.uploadFiles = exports.uploadFile = exports.updateTasks = exports.checkFiles = exports.getFreeFEM = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _formData = _interopRequireDefault(require("form-data"));

var _simulation = _interopRequireDefault(require("../../../../src/database/simulation"));

var _tools = _interopRequireDefault(require("../../../../src/lib/tools"));

var _sentry = _interopRequireDefault(require("../../../../src/lib/sentry"));

var _call = _interopRequireDefault(require("./call"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Get FreeFEM
 * @param {Object} configuration Configuration
 */
var getFreeFEM = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(configuration) {
    var analyses;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'analyses/'
            });

          case 2:
            analyses = _context.sent;
            return _context.abrupt("return", analyses.results.find(function (analysis) {
              return analysis.code === 'freefem';
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getFreeFEM(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Check files
 * @param {Object} configuration Configuration
 */


exports.getFreeFEM = getFreeFEM;

var checkFiles = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(configuration) {
    var additionalFiles;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            additionalFiles = configuration.additionalFiles.value;
            _context3.t0 = additionalFiles;

            if (!_context3.t0) {
              _context3.next = 5;
              break;
            }

            _context3.next = 5;
            return Promise.all(additionalFiles.split(',').map( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
                var file;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return getFile(configuration, id);

                      case 2:
                        file = _context2.sent;

                        if (!(file.detail === 'Not found.')) {
                          _context2.next = 5;
                          break;
                        }

                        throw new Error('File not found ' + id);

                      case 5:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x3) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function checkFiles(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Update tasks
 * @param {string} id Id
 * @param {Array} tasks Tasks
 */


exports.checkFiles = checkFiles;

var updateTasks = function updateTasks(id, tasks) {
  _simulation["default"].update({
    id: id
  }, [{
    key: 'tasks',
    value: tasks
  }]);
};
/**
 * Upload file
 * @param {Object} configuration Configuration
 * @param {string} fileName File name
 */


exports.updateTasks = updateTasks;

var uploadFile = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(configuration, fileName) {
    var fileContent, formData, file, fileJson;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _tools["default"].readFile(fileName);

          case 2:
            fileContent = _context4.sent;
            formData = new _formData["default"]();
            formData.append('file', fileContent.toString(), fileName);
            _context4.next = 7;
            return (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'files/contents/',
              method: 'POST',
              body: formData
            });

          case 7:
            file = _context4.sent;
            // RESCALE API BUG
            // response content type is text/plain but the correct type is application/json
            fileJson = JSON.parse(file);
            return _context4.abrupt("return", {
              id: fileJson.id,
              name: fileJson.name
            });

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function uploadFile(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Upload files
 * @param {Object} configuration Configuration
 * @param {Array} files Files { name, path }
 * @param {Object?} task Task
 */


exports.uploadFile = uploadFile;

var uploadFiles = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(configuration, files, task) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", Promise.all(files.map( /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(file) {
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (task) task.log += ' - ' + file.name + '\n';
                        return _context5.abrupt("return", uploadFile(configuration, file.path));

                      case 2:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x9) {
                return _ref6.apply(this, arguments);
              };
            }())));

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function uploadFiles(_x6, _x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Create job
 * @param {string} id Simulation id
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 * @param {Object} parameters Parameters
 * @param {string} command Command
 * @param {Array} geometries Geometries
 * @param {Array} couplings Coupling data & mesh
 * @param {Array} meshes Meshes
 * @param {Object} edp Edp
 */


exports.uploadFiles = uploadFiles;

var createJob = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(id, algorithm, configuration, parameters, command, geometries, couplings, meshes, edp) {
    var _parameters$walltime, _configuration$wallti;

    var name, coreType, lowPriority, numberOfCores, freefemVersion, walltime, defaultWalltime, additionalFiles, inputFiles, job;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            name = 'Tanatloc - ' + algorithm + '(' + id + ')';
            coreType = parameters.coreTypes.value;
            lowPriority = parameters.lowPriority.value;
            numberOfCores = parameters.numberOfCores.value;
            freefemVersion = parameters.freefemVersion.value;
            walltime = (_parameters$walltime = parameters.walltime) === null || _parameters$walltime === void 0 ? void 0 : _parameters$walltime.value;
            defaultWalltime = ((_configuration$wallti = configuration.walltime) === null || _configuration$wallti === void 0 ? void 0 : _configuration$wallti.value) || 48;
            additionalFiles = configuration.additionalFiles.value || '';
            inputFiles = [].concat((0, _toConsumableArray2["default"])(geometries.map(function (g) {
              return {
                id: g.id
              };
            })), (0, _toConsumableArray2["default"])(couplings.map(function (c) {
              return {
                id: c.id
              };
            })), (0, _toConsumableArray2["default"])(meshes.map(function (m) {
              return {
                id: m.id
              };
            })), [{
              id: edp.id
            }]);
            additionalFiles && inputFiles.push.apply(inputFiles, (0, _toConsumableArray2["default"])(additionalFiles.split(',').map(function (f) {
              return {
                id: f
              };
            })));
            _context7.next = 12;
            return (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'jobs/',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: name,
                isLowPriority: lowPriority,
                jobanalyses: [{
                  analysis: {
                    code: 'freefem',
                    versionName: freefemVersion
                  },
                  hardware: {
                    coreType: coreType,
                    coresPerSlot: numberOfCores,
                    walltime: walltime || defaultWalltime
                  },
                  command: command,
                  inputFiles: inputFiles
                }]
              })
            });

          case 12:
            job = _context7.sent;

            if (!(configuration.organization && configuration.project)) {
              _context7.next = 23;
              break;
            }

            _context7.prev = 14;
            _context7.next = 17;
            return (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'organizations/' + configuration.organization.value + '/jobs/' + job.id + '/project-assignment/',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                projectId: configuration.project.value
              })
            });

          case 17:
            _context7.next = 23;
            break;

          case 19:
            _context7.prev = 19;
            _context7.t0 = _context7["catch"](14);
            console.warn(_context7.t0);

            _sentry["default"].captureException(_context7.t0);

          case 23:
            return _context7.abrupt("return", job.id || {
              error: job
            });

          case 24:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[14, 19]]);
  }));

  return function createJob(_x10, _x11, _x12, _x13, _x14, _x15, _x16, _x17, _x18) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Submit job
 * @param {Object} configuration Configuration
 * @param {string} id Job id
 */


exports.createJob = createJob;

var submitJob = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(configuration, id) {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'jobs/' + id + '/submit/',
              method: 'POST'
            });

          case 2:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function submitJob(_x19, _x20) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * Get job status
 * @param {Object} configuration Configuration
 * @param {string} id Job id
 */


exports.submitJob = submitJob;

var getStatus = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(configuration, id) {
    var status, sorted;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'jobs/' + id + '/statuses/'
            });

          case 2:
            status = _context9.sent;

            if (status.results) {
              _context9.next = 5;
              break;
            }

            return _context9.abrupt("return", 'Completed');

          case 5:
            // Last status
            sorted = status.results.sort(function (a, b) {
              return b.statusDate - a.statusDate;
            });
            return _context9.abrupt("return", sorted[0].status);

          case 7:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function getStatus(_x21, _x22) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * Get in-run files
 * @param {Object} configuration Configuration
 * @param {string} id Job id
 */


exports.getStatus = getStatus;

var getInRunFiles = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(configuration, id) {
    var list;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'jobs/' + id + '/runs/1/directory-contents/'
            });

          case 2:
            list = _context10.sent;
            return _context10.abrupt("return", Array.isArray(list) ? list : []);

          case 4:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function getInRunFiles(_x23, _x24) {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * Get in-run file
 * @param {Object} configuration Configuration
 * @param {Object} file File
 */


exports.getInRunFiles = getInRunFiles;

var getInRunFile = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(configuration, file) {
    var route;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            route = file.resource.replace('/api/v2/', '');
            return _context11.abrupt("return", (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: route
            }));

          case 2:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function getInRunFile(_x25, _x26) {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * Get files
 * @param {Object} configuration Configuration
 * @param {string} id Job id
 */


exports.getInRunFile = getInRunFile;

var getFiles = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(configuration, id) {
    var list;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'jobs/' + id + '/runs/1/files/'
            });

          case 2:
            list = _context12.sent;
            return _context12.abrupt("return", list.results);

          case 4:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function getFiles(_x27, _x28) {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * Get file
 * @param {Object} configuration
 * @param {string} id File id
 */


exports.getFiles = getFiles;

var getFile = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(configuration, id) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            return _context13.abrupt("return", (0, _call["default"])({
              platform: configuration.platform.value,
              token: configuration.token.value,
              route: 'files/' + id + '/contents/'
            }));

          case 1:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function getFile(_x29, _x30) {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * Get in-run outputs
 * @param {Object} configuration Configuration
 * @param {string} log Log
 * @param {Array} availableFiles Available files
 * @param {Array} existingResults Existing results
 * @param {Array} existingDatas Existing datas
 * @param {Array} existingCouplings Existing couplings
 * @param {string} simulationPath Simulation path
 * @param {string} resultPath Result path
 * @param {string} couplingPath Coupling path
 * @param {string} dataPath Data path
 *
 * @param {Object} task Task
 */


exports.getFile = getFile;

var getInRunOutputs = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(configuration, log, availableFiles, existingResults, existingDatas, existingCouplings, simulationPath, resultPath, dataPath, couplingPath, task) {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.abrupt("return", processOutput('inrun', configuration, log, availableFiles, existingResults, existingDatas, existingCouplings, simulationPath, resultPath, dataPath, couplingPath, task));

          case 1:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function getInRunOutputs(_x31, _x32, _x33, _x34, _x35, _x36, _x37, _x38, _x39, _x40, _x41) {
    return _ref14.apply(this, arguments);
  };
}();
/**
 * Get outputs
 * @param {Object} configuration Configuration
 * @param {string} log Log
 * @param {Array} availableFiles Available files
 * @param {Array} existingResults Existing results
 * @param {Array} existingDatas Existing datas
 * @param {Array} existingCouplings Existing couplings
 * @param {string} simulationPath Simulation path
 * @param {string} resultPath Result path
 * @param {string} dataPath Data path
 * @param {string} couplingPath Coupling path
 * @param {Object} task Task
 */


exports.getInRunOutputs = getInRunOutputs;

var getOutputs = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(configuration, log, availableFiles, existingResults, existingDatas, existingCouplings, simulationPath, resultPath, dataPath, couplingPath, task) {
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            return _context15.abrupt("return", processOutput('final', configuration, log, availableFiles, existingResults, existingDatas, existingCouplings, simulationPath, resultPath, dataPath, couplingPath, task));

          case 1:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function getOutputs(_x42, _x43, _x44, _x45, _x46, _x47, _x48, _x49, _x50, _x51, _x52) {
    return _ref15.apply(this, arguments);
  };
}();
/**
 * Process output
 * @param {string} type Type
 * @param {Object} configuration Configuration
 * @param {string} log Log
 * @param {Array} availableFiles Available files
 * @param {Array} existingResults Existing results
 * @param {Array} existingDatas Existing datas
 * @param {Array} existingCouplings Existing couplings
 * @param {string} simulationPath Simulation path
 * @param {string} resultPath Result path
 * @param {string} dataPath Data path
 * @param {string} couplingPath Coupling path
 * @param {Object} task Task
 */


exports.getOutputs = getOutputs;

var processOutput = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(type, configuration, log, availableFiles, existingResults, existingDatas, existingCouplings, simulationPath, resultPath, dataPath, couplingPath, task) {
    var lines, couplingLines, resultLines, dataLines, nonResultLines, realLog, _iterator, _step, line, couplingFile, _iterator2, _step2, _line, dataFile, _iterator3, _step3, _line2, resultFile;

    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            if (!(log.includes('PROCESS COUPLING FILE') || log.includes('PROCESS VTU FILE') || log.includes('PROCESS DATA FILE'))) {
              _context16.next = 64;
              break;
            }

            lines = log.split('\n');
            couplingLines = lines.filter(function (l) {
              return l.includes('PROCESS COUPLING FILE');
            });
            resultLines = lines.filter(function (l) {
              return l.includes('PROCESS VTU FILE');
            });
            dataLines = lines.filter(function (l) {
              return l.includes('PROCESS DATA FILE');
            });
            nonResultLines = lines.filter(function (l) {
              return !l.includes('PROCESS VTU FILE') && !l.includes('PROCESS DATA FILE');
            });
            realLog = nonResultLines.join('\n'); // Get coupling

            _iterator = _createForOfIteratorHelper(couplingLines);
            _context16.prev = 8;

            _iterator.s();

          case 10:
            if ((_step = _iterator.n()).done) {
              _context16.next = 17;
              break;
            }

            line = _step.value;
            // New coupling file
            couplingFile = line.replace('PROCESS COUPLING FILE', '').replace(/\[.*\]: /g, '').trim();
            _context16.next = 15;
            return processCoupling(type, couplingFile, configuration, availableFiles, existingCouplings, simulationPath, couplingPath, task);

          case 15:
            _context16.next = 10;
            break;

          case 17:
            _context16.next = 22;
            break;

          case 19:
            _context16.prev = 19;
            _context16.t0 = _context16["catch"](8);

            _iterator.e(_context16.t0);

          case 22:
            _context16.prev = 22;

            _iterator.f();

            return _context16.finish(22);

          case 25:
            // Get data
            _iterator2 = _createForOfIteratorHelper(dataLines);
            _context16.prev = 26;

            _iterator2.s();

          case 28:
            if ((_step2 = _iterator2.n()).done) {
              _context16.next = 35;
              break;
            }

            _line = _step2.value;
            // New data
            dataFile = _line.replace('PROCESS DATA FILE', '').replace(/\[.*\]: /g, '').trim();
            _context16.next = 33;
            return processData(type, dataFile, configuration, availableFiles, existingDatas, simulationPath, dataPath, task);

          case 33:
            _context16.next = 28;
            break;

          case 35:
            _context16.next = 40;
            break;

          case 37:
            _context16.prev = 37;
            _context16.t1 = _context16["catch"](26);

            _iterator2.e(_context16.t1);

          case 40:
            _context16.prev = 40;

            _iterator2.f();

            return _context16.finish(40);

          case 43:
            // Get result
            _iterator3 = _createForOfIteratorHelper(resultLines);
            _context16.prev = 44;

            _iterator3.s();

          case 46:
            if ((_step3 = _iterator3.n()).done) {
              _context16.next = 53;
              break;
            }

            _line2 = _step3.value;
            // New result
            resultFile = _line2.replace('PROCESS VTU FILE', '').replace(/\[.*\]: /g, '').trim();
            _context16.next = 51;
            return processResult(type, resultFile, configuration, availableFiles, existingResults, simulationPath, resultPath, task);

          case 51:
            _context16.next = 46;
            break;

          case 53:
            _context16.next = 58;
            break;

          case 55:
            _context16.prev = 55;
            _context16.t2 = _context16["catch"](44);

            _iterator3.e(_context16.t2);

          case 58:
            _context16.prev = 58;

            _iterator3.f();

            return _context16.finish(58);

          case 61:
            return _context16.abrupt("return", realLog);

          case 64:
            return _context16.abrupt("return", log);

          case 65:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[8, 19, 22, 25], [26, 37, 40, 43], [44, 55, 58, 61]]);
  }));

  return function processOutput(_x53, _x54, _x55, _x56, _x57, _x58, _x59, _x60, _x61, _x62, _x63, _x64) {
    return _ref16.apply(this, arguments);
  };
}();
/**
 * Process result
 * @param {string} Type
 * @param {string} resultFile Result file
 * @param {Array} availableFiles Available files
 * @param {Array} existingResults Existing results
 * @param {string} simulationPath Simulation path
 * @param {string} resultPath Result path
 * @param {Object} task Task
 */


var processResult = /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(type, resultFile, configuration, availableFiles, existingResults, simulationPath, resultPath, task) {
    var partPath, existing, file, fileContent, convertData, convertError, _convertData, _convertData$trim, results;

    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            // Part path
            partPath = resultFile.replace('.vtu', ''); // Check already existing

            existing = existingResults.includes(resultFile);

            if (!existing) {
              _context17.next = 4;
              break;
            }

            return _context17.abrupt("return");

          case 4:
            _context17.prev = 4;

            // Get file
            if (type === 'inrun') {
              file = availableFiles.find(function (f) {
                return f.path.includes(resultFile);
              });
            } else {
              file = availableFiles.find(function (f) {
                return f.relativePath.includes(resultFile);
              });
            }

            if (file) {
              _context17.next = 8;
              break;
            }

            throw new Error('No available file (' + resultFile + ')');

          case 8:
            if (!(type === 'inrun')) {
              _context17.next = 18;
              break;
            }

            _context17.next = 11;
            return getInRunFile(configuration, file);

          case 11:
            fileContent = _context17.sent;

            if (!fileContent.detail) {
              _context17.next = 14;
              break;
            }

            throw new Error('Run is not active. Trying to get the file at the end (' + resultFile + ')');

          case 14:
            if (!(typeof fileContent !== 'string')) {
              _context17.next = 16;
              break;
            }

            throw new Error('Rescale empty response (' + resultFile + ')');

          case 16:
            _context17.next = 21;
            break;

          case 18:
            _context17.next = 20;
            return getFile(configuration, file.id);

          case 20:
            fileContent = _context17.sent;

          case 21:
            _context17.next = 23;
            return _tools["default"].writeFile(_path["default"].join(simulationPath, resultPath), resultFile, fileContent);

          case 23:
            // Convert file
            convertData = '';
            convertError = '';
            _context17.next = 27;
            return _tools["default"].convert(_path["default"].join(simulationPath, 'run', 'result'), {
              name: resultFile,
              target: partPath
            }, function (_ref18) {
              var data = _ref18.data,
                  error = _ref18.error;
              data && (convertData += data);
              error && (convertError += error);
            }, {
              isResult: true
            });

          case 27:
            if (convertError) {
              console.warn('Warning: Result converting process failed (' + convertError + ')');
              task.warning += 'Warning: Result converting process failed (' + convertError + ')\n';
            } else {
              results = (_convertData = convertData) === null || _convertData === void 0 ? void 0 : (_convertData$trim = _convertData.trim()) === null || _convertData$trim === void 0 ? void 0 : _convertData$trim.split('\n').map(function (res) {
                return JSON.parse(res);
              }); // Update task

              task.files = [].concat((0, _toConsumableArray2["default"])(task.files || []), (0, _toConsumableArray2["default"])(results.map(function (result) {
                return {
                  type: 'result',
                  fileName: resultFile,
                  originPath: resultPath,
                  name: result.name,
                  json: result.path,
                  glb: result.path + '.glb'
                };
              }))); // Update existing results

              existingResults.push(resultFile);
            }

            _context17.next = 34;
            break;

          case 30:
            _context17.prev = 30;
            _context17.t0 = _context17["catch"](4);
            console.warn('Warning: Unable to convert result file (' + _context17.t0.message + ')');
            task.warning += 'Warning: Unable to convert result file (' + _context17.t0.message + ')\n';

          case 34:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[4, 30]]);
  }));

  return function processResult(_x65, _x66, _x67, _x68, _x69, _x70, _x71, _x72) {
    return _ref17.apply(this, arguments);
  };
}();
/**
 * Process data
 * @param {string} type Type
 * @param {*} couplingFile Coupling file
 * @param {*} configuration Configuration
 * @param {*} availableFiles Available files
 * @param {*} existingCouplings Existing couplings
 * @param {*} simulationPath Simulation path
 * @param {*} couplingPath Data path
 * @param {*} task Task
 */


var processCoupling = /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(type, couplingFile, configuration, availableFiles, existingCouplings, simulationPath, couplingPath, task) {
    var existing, file, fileContent;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            // Check already existing
            existing = existingCouplings.includes(couplingFile);

            if (!existing) {
              _context18.next = 3;
              break;
            }

            return _context18.abrupt("return");

          case 3:
            _context18.prev = 3;

            // Get file
            if (type === 'inrun') {
              file = availableFiles.find(function (f) {
                return f.path.includes(couplingFile);
              });
            } else {
              file = availableFiles.find(function (f) {
                return f.relativePath.includes(couplingFile);
              });
            }

            if (file) {
              _context18.next = 7;
              break;
            }

            throw new Error('No available file (' + couplingFile + ')');

          case 7:
            if (!(type === 'inrun')) {
              _context18.next = 25;
              break;
            }

            _context18.next = 10;
            return getInRunFile(configuration, file);

          case 10:
            fileContent = _context18.sent;

            if (!fileContent.text) {
              _context18.next = 17;
              break;
            }

            _context18.next = 14;
            return fileContent.text();

          case 14:
            fileContent = _context18.sent;
            _context18.next = 23;
            break;

          case 17:
            if (!fileContent.detail) {
              _context18.next = 21;
              break;
            }

            throw new Error('Run is not active. Trying to get the file at the end (' + couplingFile + ')');

          case 21:
            if (!(typeof fileContent !== 'string')) {
              _context18.next = 23;
              break;
            }

            throw new Error('Rescale empty response (' + couplingFile + ')');

          case 23:
            _context18.next = 32;
            break;

          case 25:
            _context18.next = 27;
            return getFile(configuration, file.id);

          case 27:
            fileContent = _context18.sent;

            if (!fileContent.text) {
              _context18.next = 32;
              break;
            }

            _context18.next = 31;
            return fileContent.text();

          case 31:
            fileContent = _context18.sent;

          case 32:
            _context18.next = 34;
            return _tools["default"].writeFile(_path["default"].join(simulationPath, couplingPath), couplingFile, fileContent);

          case 34:
            // Update existing datas
            existingCouplings.push(couplingFile);
            _context18.next = 41;
            break;

          case 37:
            _context18.prev = 37;
            _context18.t0 = _context18["catch"](3);
            console.warn('Warning: Unable to read coupling file (' + _context18.t0.message + ')');
            task.warning += 'Warning: Unable to read coupling file (' + _context18.t0.message + ')\n';

          case 41:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[3, 37]]);
  }));

  return function processCoupling(_x73, _x74, _x75, _x76, _x77, _x78, _x79, _x80) {
    return _ref19.apply(this, arguments);
  };
}();
/**
 * Process data
 * @param {string} type Type
 * @param {*} dataFile Data file
 * @param {*} configuration Configuration
 * @param {*} availableFiles Available files
 * @param {*} existingDatas Existing datas
 * @param {*} simulationPath Simulation path
 * @param {*} dataPath Data path
 * @param {*} task Task
 */


var processData = /*#__PURE__*/function () {
  var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(type, dataFile, configuration, availableFiles, existingDatas, simulationPath, dataPath, task) {
    var existing, file, fileContent;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            // Check already existing
            existing = existingDatas.includes(dataFile);

            if (!existing) {
              _context19.next = 3;
              break;
            }

            return _context19.abrupt("return");

          case 3:
            _context19.prev = 3;

            // Get file
            if (type === 'inrun') {
              file = availableFiles.find(function (f) {
                return f.path.includes(dataFile);
              });
            } else {
              file = availableFiles.find(function (f) {
                return f.relativePath.includes(dataFile);
              });
            }

            if (file) {
              _context19.next = 7;
              break;
            }

            throw new Error('No available file (' + dataFile + ')');

          case 7:
            if (!(type === 'inrun')) {
              _context19.next = 17;
              break;
            }

            _context19.next = 10;
            return getInRunFile(configuration, file);

          case 10:
            fileContent = _context19.sent;

            if (!fileContent.detail) {
              _context19.next = 13;
              break;
            }

            throw new Error('Run is not active. Trying to get the file at the end (' + dataFile + ')');

          case 13:
            if (!(typeof fileContent !== 'string')) {
              _context19.next = 15;
              break;
            }

            throw new Error('Rescale empty response (' + dataFile + ')');

          case 15:
            _context19.next = 20;
            break;

          case 17:
            _context19.next = 19;
            return getFile(configuration, file.id);

          case 19:
            fileContent = _context19.sent;

          case 20:
            _context19.next = 22;
            return _tools["default"].writeFile(_path["default"].join(simulationPath, dataPath), dataFile, fileContent);

          case 22:
            // Update task
            task.datas = [].concat((0, _toConsumableArray2["default"])(task.datas || []), [JSON.parse(fileContent.toString())]); // Update existing datas

            existingDatas.push(dataFile);
            _context19.next = 30;
            break;

          case 26:
            _context19.prev = 26;
            _context19.t0 = _context19["catch"](3);
            console.warn('Warning: Unable to read data file (' + _context19.t0.message + ')');
            task.warning += 'Warning: Unable to read data file (' + _context19.t0.message + ')\n';

          case 30:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[3, 26]]);
  }));

  return function processData(_x81, _x82, _x83, _x84, _x85, _x86, _x87, _x88) {
    return _ref20.apply(this, arguments);
  };
}();