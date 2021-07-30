"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require(".."));

jest.mock("../../../../../config/storage", function () {
  return {
    SIMULATION: 'SIMULATION'
  };
});
var mockUpdate = jest.fn();
jest.mock("../../../../../src/database/simulation", function () {
  return {
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", mockUpdate());

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
var mockRender = jest.fn();
jest.mock("../../../../../src/lib/template", function () {
  return {
    render: function () {
      var _render = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", mockRender());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  };
});
var mockCreatePath = jest.fn();
jest.mock("../../../../../src/lib/tools", function () {
  return {
    createPath: function () {
      var _createPath = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", mockCreatePath());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function createPath() {
        return _createPath.apply(this, arguments);
      }

      return createPath;
    }()
  };
});
var mockToThree = jest.fn();
jest.mock("../../../../../src/services", function () {
  return {
    toThree: function () {
      var _toThree = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(path, fileIn, pathOut, callback) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockToThree(path, fileIn, pathOut, callback));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function toThree(_x, _x2, _x3, _x4) {
        return _toThree.apply(this, arguments);
      }

      return toThree;
    }()
  };
});
var mockGetFreeFEM = jest.fn();
var mockCheckFiles = jest.fn();
var mockUpdateTasks = jest.fn();
var mockUploadFile = jest.fn();
var mockUploadFiles = jest.fn();
var mockCreateJob = jest.fn();
var mockSubmitJob = jest.fn();
var mockGetStatus = jest.fn();
var mockGetInRunFiles = jest.fn();
var mockGetInRunFile = jest.fn();
var mockGetFiles = jest.fn();
var mockGetFile = jest.fn();
var mockGetInRunOutputs = jest.fn();
var mockGetOutputs = jest.fn();
jest.mock("../tools", function () {
  return {
    getFreeFEM: function () {
      var _getFreeFEM = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockGetFreeFEM());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function getFreeFEM() {
        return _getFreeFEM.apply(this, arguments);
      }

      return getFreeFEM;
    }(),
    checkFiles: function () {
      var _checkFiles = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", mockCheckFiles());

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function checkFiles() {
        return _checkFiles.apply(this, arguments);
      }

      return checkFiles;
    }(),
    updateTasks: function () {
      var _updateTasks = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockUpdateTasks());

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function updateTasks() {
        return _updateTasks.apply(this, arguments);
      }

      return updateTasks;
    }(),
    uploadFile: function () {
      var _uploadFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockUploadFile());

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function uploadFile() {
        return _uploadFile.apply(this, arguments);
      }

      return uploadFile;
    }(),
    uploadFiles: function () {
      var _uploadFiles = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", mockUploadFiles());

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function uploadFiles() {
        return _uploadFiles.apply(this, arguments);
      }

      return uploadFiles;
    }(),
    createJob: function () {
      var _createJob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", mockCreateJob());

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function createJob() {
        return _createJob.apply(this, arguments);
      }

      return createJob;
    }(),
    submitJob: function () {
      var _submitJob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", mockSubmitJob());

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function submitJob() {
        return _submitJob.apply(this, arguments);
      }

      return submitJob;
    }(),
    getStatus: function () {
      var _getStatus = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", mockGetStatus());

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function getStatus() {
        return _getStatus.apply(this, arguments);
      }

      return getStatus;
    }(),
    getInRunFiles: function () {
      var _getInRunFiles = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.abrupt("return", mockGetInRunFiles());

              case 1:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));

      function getInRunFiles() {
        return _getInRunFiles.apply(this, arguments);
      }

      return getInRunFiles;
    }(),
    getInRunFile: function () {
      var _getInRunFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                return _context14.abrupt("return", mockGetInRunFile());

              case 1:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      }));

      function getInRunFile() {
        return _getInRunFile.apply(this, arguments);
      }

      return getInRunFile;
    }(),
    getFiles: function () {
      var _getFiles = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt("return", mockGetFiles());

              case 1:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15);
      }));

      function getFiles() {
        return _getFiles.apply(this, arguments);
      }

      return getFiles;
    }(),
    getFile: function () {
      var _getFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                return _context16.abrupt("return", mockGetFile());

              case 1:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16);
      }));

      function getFile() {
        return _getFile.apply(this, arguments);
      }

      return getFile;
    }(),
    getInRunOutputs: function () {
      var _getInRunOutputs = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                return _context17.abrupt("return", mockGetInRunOutputs());

              case 1:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17);
      }));

      function getInRunOutputs() {
        return _getInRunOutputs.apply(this, arguments);
      }

      return getInRunOutputs;
    }(),
    getOutputs: function () {
      var _getOutputs = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                return _context18.abrupt("return", mockGetOutputs());

              case 1:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18);
      }));

      function getOutputs() {
        return _getOutputs.apply(this, arguments);
      }

      return getOutputs;
    }()
  };
});
var mockCall = jest.fn();
jest.mock("../call", function () {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(param) {
      return _regenerator["default"].wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              return _context19.abrupt("return", mockCall(param));

            case 1:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }));

    return function (_x5) {
      return _ref.apply(this, arguments);
    };
  }();
});
describe('plugins/rescale/src/lib', function () {
  beforeEach(function () {
    mockUpdate.mockReset();
    mockRender.mockReset();
    mockCreatePath.mockReset();
    mockToThree.mockReset();
    mockGetFreeFEM.mockReset();
    mockUpdateTasks.mockReset();
    mockUploadFile.mockReset();
    mockUploadFiles.mockReset();
    mockCreateJob.mockReset();
    mockCreateJob.mockImplementation(function () {
      return 'id';
    });
    mockSubmitJob.mockReset();
    mockGetStatus.mockReset();
    mockGetInRunFiles.mockReset();
    mockGetInRunFile.mockReset();
    mockGetFiles.mockReset();
    mockGetFile.mockReset();
    mockGetInRunOutputs.mockReset();
    mockGetOutputs.mockReset();
    mockCall.mockReset();
  });
  test('init', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
    var res;
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            // Normal
            mockCall.mockImplementation(function () {
              return {
                results: [{}]
              };
            });
            mockGetFreeFEM.mockImplementation(function () {
              return [{}];
            });
            _context20.next = 4;
            return _["default"].init({
              platform: {},
              token: {},
              additionalFiles: {
                value: ''
              }
            });

          case 4:
            res = _context20.sent;
            expect(mockCall).toHaveBeenCalledTimes(1);
            expect(mockCheckFiles).toHaveBeenCalledTimes(1);
            expect(mockGetFreeFEM).toHaveBeenCalledTimes(1);
            expect(res).toEqual({
              data: {
                coreTypes: [{}],
                freefem: [{}]
              }
            }); // Invalid token

            mockCall.mockImplementation(function () {
              return {
                detail: 'Invalid token.'
              };
            });
            _context20.prev = 10;
            _context20.next = 13;
            return _["default"].init({
              platform: {},
              token: {},
              additionalFiles: {
                value: ''
              }
            });

          case 13:
            expect(true).toBe(false);
            _context20.next = 19;
            break;

          case 16:
            _context20.prev = 16;
            _context20.t0 = _context20["catch"](10);
            expect(true).toBe(true);

          case 19:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[10, 16]]);
  })));
  test('computeSimulation', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
    var statusCount;
    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            mockUploadFile.mockImplementation(function () {
              return {};
            });
            mockGetStatus.mockImplementation(function () {
              return 'Completed';
            });
            mockGetInRunFiles.mockImplementation(function () {
              return [];
            });
            mockGetFiles.mockImplementation(function () {
              return [];
            }); // Minimal

            _context21.next = 6;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {
              run: {
                cloudServer: {
                  configuration: {},
                  inUseConfiguration: {
                    numberOfCores: {
                      value: 64
                    }
                  }
                }
              }
            });

          case 6:
            // Create job error
            mockCreateJob.mockImplementation(function () {
              return {
                error: 'error'
              };
            });
            _context21.next = 9;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {
              run: {
                cloudServer: {
                  configuration: {},
                  inUseConfiguration: {
                    numberOfCores: {
                      value: 64
                    }
                  }
                }
              }
            });

          case 9:
            mockCreateJob.mockImplementation(function () {
              return 'id';
            }); // With geometries, meshes

            _context21.next = 12;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {
              geometry1: {
                meshable: true,
                name: 'name',
                path: 'path',
                file: 'file'
              },
              geometry2: {
                meshable: false,
                name: 'name',
                path: 'path',
                file: 'file'
              },
              boundaryConditions: {
                index: 0,
                key1: {},
                key2: {
                  values: [{
                    selected: [1]
                  }],
                  refineFactor: 5
                }
              },
              run: {
                cloudServer: {
                  configuration: {},
                  inUseConfiguration: {
                    numberOfCores: {
                      value: 64
                    }
                  }
                }
              }
            });

          case 12:
            // With files
            mockGetFiles.mockImplementation(function () {
              return [{
                relativePath: 'process_log.log'
              }, {
                relativePath: 'process_data.log'
              }];
            });
            mockGetFile.mockImplementation(function () {
              return 'log';
            });
            mockGetOutputs.mockImplementation(function () {
              return 'realLog';
            });
            _context21.next = 17;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {
              run: {
                cloudServer: {
                  configuration: {},
                  inUseConfiguration: {
                    numberOfCores: {
                      value: 64
                    }
                  }
                }
              }
            });

          case 17:
            mockGetFile.mockImplementation(function () {
              return {
                detail: 'not found'
              };
            });
            _context21.next = 20;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {
              run: {
                cloudServer: {
                  configuration: {},
                  inUseConfiguration: {
                    numberOfCores: {
                      value: 64
                    }
                  }
                }
              }
            });

          case 20:
            // With in-run files
            statusCount = 0;
            mockGetStatus.mockImplementation(function () {
              statusCount++;
              return statusCount === 1 ? 'Executing' : 'Completed';
            });
            _context21.next = 24;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {
              run: {
                cloudServer: {
                  configuration: {},
                  inUseConfiguration: {
                    numberOfCores: {
                      value: 64
                    }
                  }
                }
              }
            });

          case 24:
            statusCount = 0;
            mockGetInRunFiles.mockImplementation(function () {
              return [{
                path: 'process_log.log'
              }, {
                path: 'process_data.log'
              }];
            });
            mockGetInRunFile.mockImplementation(function () {
              return 'log';
            });
            mockGetInRunOutputs.mockImplementation(function () {
              return 'realLog';
            });
            _context21.next = 30;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {
              run: {
                cloudServer: {
                  configuration: {},
                  inUseConfiguration: {
                    numberOfCores: {
                      value: 64
                    }
                  }
                }
              }
            });

          case 30:
            statusCount = 0;
            mockGetInRunFile.mockImplementation(function () {
              return {
                detail: 'not found'
              };
            });
            _context21.next = 34;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {
              run: {
                cloudServer: {
                  configuration: {},
                  inUseConfiguration: {
                    numberOfCores: {
                      value: 64
                    }
                  }
                }
              }
            });

          case 34:
            // Other status
            statusCount = 0;
            mockGetStatus.mockImplementation(function () {
              statusCount++;
              return statusCount === 1 ? 'Unknow' : 'Completed';
            });
            _context21.next = 38;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {
              run: {
                cloudServer: {
                  configuration: {},
                  inUseConfiguration: {
                    numberOfCores: {
                      value: 64
                    }
                  }
                }
              }
            });

          case 38:
            _context21.prev = 38;
            _context21.next = 41;
            return _["default"].computeSimulation({
              id: 'id'
            }, 'algorithm', {});

          case 41:
            expect(true).toBe(false);
            _context21.next = 47;
            break;

          case 44:
            _context21.prev = 44;
            _context21.t0 = _context21["catch"](38);
            expect(true).toBe(true);

          case 47:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, null, [[38, 44]]);
  })), 20000);
  test('stop', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
    var tasks, configuration;
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            tasks = [{
              status: 'other'
            }, {
              status: 'process'
            }];
            configuration = {
              run: {
                cloudServer: {
                  configuration: {
                    platform: {
                      value: 'platform'
                    },
                    token: {
                      value: 'token'
                    }
                  }
                }
              }
            };
            _context22.next = 4;
            return _["default"].stop(tasks, configuration);

          case 4:
            expect(mockCall).toHaveBeenCalledTimes(2);

          case 5:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  })));
});