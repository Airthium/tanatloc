"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Tools = _interopRequireWildcard(require("../tools"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var mockPath = jest.fn();
jest.mock('path', function () {
  return {
    join: function join() {
      return mockPath();
    }
  };
});
var mockSimulationUpdate = jest.fn();
jest.mock("../../../../../src/database/simulation", function () {
  return {
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", mockSimulationUpdate());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockReadFile = jest.fn();
var mockWriteFile = jest.fn();
var mockConvert = jest.fn();
jest.mock("../../../../../src/lib/tools", function () {
  return {
    readFile: function () {
      var _readFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", mockReadFile());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function readFile() {
        return _readFile.apply(this, arguments);
      }

      return readFile;
    }(),
    writeFile: function () {
      var _writeFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", mockWriteFile());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function writeFile() {
        return _writeFile.apply(this, arguments);
      }

      return writeFile;
    }(),
    convert: function () {
      var _convert = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(path, file, callback) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockConvert(path, file, callback));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function convert(_x, _x2, _x3) {
        return _convert.apply(this, arguments);
      }

      return convert;
    }()
  };
});
var mockCaptureException = jest.fn();
jest.mock("../../../../../src/lib/sentry", function () {
  return {
    captureException: function captureException() {
      return mockCaptureException();
    }
  };
});
var mockCall = jest.fn();
jest.mock("../call", function () {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(param) {
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", mockCall(param));

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x4) {
      return _ref.apply(this, arguments);
    };
  }();
});
describe('plugins/rescale/src/lib/tools', function () {
  var configuration = {
    platform: {
      value: 'platform'
    },
    token: {
      value: 'token'
    },
    additionalFiles: {
      value: 'id1,id2'
    }
  };
  var parameters = {
    coreTypes: {
      value: 'coreTypes'
    },
    lowPriority: {
      value: false
    },
    numberOfCores: {
      value: 64
    },
    freefemVersion: {
      value: 'xx'
    }
  };
  beforeEach(function () {
    mockPath.mockReset();
    mockSimulationUpdate.mockReset();
    mockReadFile.mockReset();
    mockWriteFile.mockReset();
    mockConvert.mockReset();
    mockCaptureException.mockReset();
    mockCall.mockReset();
  });
  test('getFreeFEM', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var res;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            mockCall.mockImplementation(function () {
              return {
                results: [{
                  code: 'freefem',
                  version: 'xx'
                }]
              };
            });
            _context6.next = 3;
            return Tools.getFreeFEM(configuration);

          case 3:
            res = _context6.sent;
            expect(res).toEqual({
              code: 'freefem',
              version: 'xx'
            });

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  test('checkFiles', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var res;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            mockCall.mockImplementation(function () {
              return {};
            });
            _context7.next = 3;
            return Tools.checkFiles(configuration);

          case 3:
            res = _context7.sent;
            expect(res).toBe();
            mockCall.mockImplementation(function () {
              return {
                detail: 'Not found.'
              };
            });
            _context7.prev = 6;
            _context7.next = 9;
            return Tools.checkFiles(configuration);

          case 9:
            expect(true).toBe(false);
            _context7.next = 15;
            break;

          case 12:
            _context7.prev = 12;
            _context7.t0 = _context7["catch"](6);
            expect(true).toBe(true);

          case 15:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[6, 12]]);
  })));
  test('updateTasks', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return Tools.updateTasks();

          case 2:
            expect(mockSimulationUpdate).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })));
  test('uploadFile', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var file;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            mockReadFile.mockImplementation(function () {
              return 'readFile';
            });
            mockCall.mockImplementation(function () {
              return '{ "id": "id" }';
            });
            _context9.next = 4;
            return Tools.uploadFile(configuration);

          case 4:
            file = _context9.sent;
            expect(mockReadFile).toHaveBeenCalledTimes(1);
            expect(file).toEqual({
              id: 'id',
              name: undefined
            });

          case 7:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
  test('uploadFiles', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var files;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            mockReadFile.mockImplementation(function () {
              return 'readFile';
            });
            mockCall.mockImplementation(function () {
              return '{ "id": "id" }';
            });
            _context10.next = 4;
            return Tools.uploadFiles(configuration, [{}], {});

          case 4:
            files = _context10.sent;
            expect(mockReadFile).toHaveBeenCalledTimes(1);
            expect(files).toEqual([{
              id: 'id',
              name: undefined
            }]); // Without task

            _context10.next = 9;
            return Tools.uploadFiles(configuration, [{}]);

          case 9:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  })));
  test('createJob', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var job, callCount;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            configuration.additionalFiles.value = undefined;
            mockCall.mockImplementation(function () {
              return {
                id: 'id'
              };
            });
            _context11.next = 4;
            return Tools.createJob('id', 'algorithm', configuration, parameters, 'command', [{}], [{}], [{}], {});

          case 4:
            job = _context11.sent;
            expect(job).toBe('id'); // With additionalFiles, organization & projects

            configuration.additionalFiles.value = 'file1';
            configuration.organization = {
              value: 'org'
            };
            configuration.project = {
              value: 'project'
            };
            _context11.next = 11;
            return Tools.createJob('id', 'algorithm', configuration, parameters, 'command', [{}], [{}], [{}], {});

          case 11:
            expect(job).toBe('id'); // With project-assignment error

            callCount = 0;
            mockCall.mockImplementation(function () {
              callCount++;
              if (callCount === 1) return {};
              throw new Error();
            });
            _context11.next = 16;
            return Tools.createJob('id', 'algorithm', configuration, parameters, 'command', [{}], [{}], [{}], {});

          case 16:
            expect(mockCaptureException).toHaveBeenCalledTimes(1);

          case 17:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  })));
  test('submitJob', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return Tools.submitJob(configuration);

          case 2:
            expect(mockCall).toHaveBeenCalledTimes(1);

          case 3:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  })));
  test('getStatus', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
    var status;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            mockCall.mockImplementation(function () {
              return {};
            }); // Empty response (Rescale bug - bad Content-Type header)

            _context13.next = 3;
            return Tools.getStatus(configuration);

          case 3:
            status = _context13.sent;
            expect(status).toBe('Completed');
            mockCall.mockImplementation(function () {
              return {
                results: [{
                  statusDate: '0',
                  status: 'Completed'
                }, {
                  statusDate: '1',
                  status: 'Executing'
                }]
              };
            });
            _context13.next = 8;
            return Tools.getStatus(configuration);

          case 8:
            status = _context13.sent;
            expect(status).toBe('Executing');

          case 10:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  })));
  test('getInRunFiles', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    var files;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return Tools.getInRunFiles(configuration);

          case 2:
            files = _context14.sent;
            expect(files).toEqual([]);
            mockCall.mockImplementation(function () {
              return [{}];
            });
            _context14.next = 7;
            return Tools.getInRunFiles(configuration);

          case 7:
            files = _context14.sent;
            expect(files).toEqual([{}]);

          case 9:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  })));
  test('getInFunFile', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
    var file;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return Tools.getInRunFile(configuration, {
              resource: 'api/v2/file'
            });

          case 2:
            file = _context15.sent;
            expect(file).toBe();

          case 4:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  })));
  test('getFiles', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    var files;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            mockCall.mockImplementation(function () {
              return {
                results: [{}]
              };
            });
            _context16.next = 3;
            return Tools.getFiles(configuration);

          case 3:
            files = _context16.sent;
            expect(files).toEqual([{}]);

          case 5:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  })));
  test('getFile', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
    var file;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return Tools.getFile(configuration);

          case 2:
            file = _context17.sent;
            expect(file).toBe();

          case 4:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  })));
  test('getInRunOuputs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return Tools.getInRunOutputs(configuration, 'log', [], [], [], [], 'path', 'path', 'path', 'path', {});

          case 2:
            // With results & data
            mockCall.mockImplementation(function () {
              return '{ "string": "string" }';
            });
            mockConvert.mockImplementation(function (path, file, callback) {
              callback({
                data: '{ "test": "test" }'
              });
              return {};
            });
            _context18.next = 6;
            return Tools.getInRunOutputs(configuration, 'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat', [{
              resource: 'resource',
              path: 'result2.vtu'
            }, {
              resource: 'resource',
              path: 'data2.dat'
            }], ['result1.vtu'], ['data1.dat'], ['coupling1.dat'], 'path', 'path', 'path', 'path', {});

          case 6:
            // Convert error
            mockConvert.mockImplementation(function () {
              throw new Error();
            });
            _context18.next = 9;
            return Tools.getInRunOutputs(configuration, 'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat', [{
              resource: 'resource',
              path: 'result2.vtu'
            }, {
              resource: 'resource',
              path: 'data2.dat'
            }], ['result1.vtu'], ['data1.dat'], ['coupling1.dat'], 'path', 'path', 'path', 'path', {});

          case 9:
            // Convert stderr
            mockConvert.mockImplementation(function (path, file, callback) {
              callback({
                error: 'error'
              });
              return {};
            });
            _context18.next = 12;
            return Tools.getInRunOutputs(configuration, 'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat', [{
              resource: 'resource',
              path: 'result2.vtu'
            }, {
              resource: 'resource',
              path: 'data2.dat'
            }], ['result1.vtu'], ['data1.dat'], ['coupling1.dat'], 'path', 'path', 'path', 'path', {});

          case 12:
            // Not a string
            mockCall.mockImplementation(function () {
              return {};
            });
            _context18.next = 15;
            return Tools.getInRunOutputs(configuration, 'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat', [{
              resource: 'resource',
              path: 'result2.vtu'
            }, {
              resource: 'resource',
              path: 'data2.dat'
            }], ['result1.vtu'], ['data1.dat'], ['coupling1.dat'], 'path', 'path', 'path', 'path', {});

          case 15:
            // Inactive run
            mockCall.mockImplementation(function () {
              return {
                detail: 'detail'
              };
            });
            _context18.next = 18;
            return Tools.getInRunOutputs(configuration, 'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat', [{
              resource: 'resource',
              path: 'result2.vtu'
            }, {
              resource: 'resource',
              path: 'data2.dat'
            }], ['result1.vtu'], ['data1.dat'], ['coupling1.dat'], 'path', 'path', 'path', 'path', {});

          case 18:
            // No available file
            mockCall.mockImplementation(function () {
              return {
                detail: 'detail'
              };
            });
            _context18.next = 21;
            return Tools.getInRunOutputs(configuration, 'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat', [{
              resource: 'resource',
              path: 'result3.vtu'
            }, {
              resource: 'resource',
              path: 'data3.dat'
            }], ['result1.vtu'], ['data1.dat'], ['coupling1.dat'], 'path', 'path', 'path', 'path', {});

          case 21:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  })));
  test('getOuputs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return Tools.getOutputs(configuration, 'log', [], [], [], [], 'path', 'path', 'path', 'path', {});

          case 2:
            // With results & data
            mockCall.mockImplementation(function () {
              return '{ "string": "string" }';
            });
            mockConvert.mockImplementation(function (path, file, callback) {
              callback({
                data: '{ "test": "test" }'
              });
              return {};
            });
            _context19.next = 6;
            return Tools.getOutputs(configuration, 'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat', [{
              relativePath: 'result2.vtu'
            }, {
              relativePath: 'data2.dat'
            }], ['result1.vtu'], ['data1.dat'], ['coupling1.dat'], 'path', 'path', 'path', 'path', {});

          case 6:
            // Convert error
            mockConvert.mockImplementation(function () {
              throw new Error();
            });
            _context19.next = 9;
            return Tools.getOutputs(configuration, 'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat', [{
              relativePath: 'result2.vtu'
            }, {
              relativePath: 'data2.dat'
            }], ['result1.vtu'], ['data1.dat'], ['coupling1.dat'], 'path', 'path', 'path', 'path', {});

          case 9:
            // Convert stderr
            mockConvert.mockImplementation(function (path, file, callback) {
              callback({
                error: 'error'
              });
              return {};
            });
            _context19.next = 12;
            return Tools.getOutputs(configuration, 'log\nPROCESS VTU FILE result1.vtu\nPROCESS VTU FILE result2.vtu\nPROCESS DATA FILE data1.dat\nPROCESS DATA FILE data2.dat', [{
              relativePath: 'result2.vtu'
            }, {
              relativePath: 'data2.dat'
            }], ['result1.vtu'], ['data1.dat'], ['coupling1.dat'], 'path', 'path', 'path', 'path', {});

          case 12:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  })));
});