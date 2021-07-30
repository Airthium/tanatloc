"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require("../"));

var mockPath = jest.fn();
jest.mock('path', function () {
  return {
    join: function join() {
      return mockPath();
    }
  };
});
jest.mock("../../../../config/storage", function () {
  return {};
});
var mockCompute = jest.fn();
var mockStop = jest.fn();
jest.mock("../../../../plugins/api", function () {
  return {
    key: {
      key: 'key',
      computeSimulation: function () {
        var _computeSimulation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", mockCompute());

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function computeSimulation() {
          return _computeSimulation.apply(this, arguments);
        }

        return computeSimulation;
      }(),
      stop: function () {
        var _stop = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", mockStop());

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function stop() {
          return _stop.apply(this, arguments);
        }

        return stop;
      }()
    }
  };
});
var mockAdd = jest.fn();
var mockGet = jest.fn();
var mockUpdate = jest.fn();
var mockDelete = jest.fn();
jest.mock("../../../database/simulation", function () {
  return {
    add: function () {
      var _add = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", mockAdd());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function add() {
        return _add.apply(this, arguments);
      }

      return add;
    }(),
    get: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", mockGet());

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function get() {
        return _get.apply(this, arguments);
      }

      return get;
    }(),
    update: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", mockUpdate());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }(),
    del: function () {
      var _del = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", mockDelete());

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function del() {
        return _del.apply(this, arguments);
      }

      return del;
    }()
  };
});
var mockUserGet = jest.fn();
jest.mock("../../user", function () {
  return {
    get: function () {
      var _get2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", mockUserGet());

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function get() {
        return _get2.apply(this, arguments);
      }

      return get;
    }()
  };
});
var mockUpdateProject = jest.fn();
jest.mock("../../project", function () {
  return {
    update: function () {
      var _update2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", mockUpdateProject());

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function update() {
        return _update2.apply(this, arguments);
      }

      return update;
    }()
  };
});
var mockGeometryGet = jest.fn();
jest.mock("../../geometry", function () {
  return {
    get: function () {
      var _get3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", mockGeometryGet());

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function get() {
        return _get3.apply(this, arguments);
      }

      return get;
    }()
  };
});
var mockReadFile = jest.fn();
var mockWriteFile = jest.fn();
var mockCopyFile = jest.fn();
var mockConvert = jest.fn();
var mockRemoveFile = jest.fn();
var mockRemoveDirectory = jest.fn();
jest.mock("../../tools", function () {
  return {
    readFile: function () {
      var _readFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", mockReadFile());

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function readFile() {
        return _readFile.apply(this, arguments);
      }

      return readFile;
    }(),
    writeFile: function () {
      var _writeFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", mockWriteFile());

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function writeFile() {
        return _writeFile.apply(this, arguments);
      }

      return writeFile;
    }(),
    copyFile: function () {
      var _copyFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", mockCopyFile());

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function copyFile() {
        return _copyFile.apply(this, arguments);
      }

      return copyFile;
    }(),
    convert: function () {
      var _convert = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.abrupt("return", mockConvert());

              case 1:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));

      function convert() {
        return _convert.apply(this, arguments);
      }

      return convert;
    }(),
    removeFile: function () {
      var _removeFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                return _context14.abrupt("return", mockRemoveFile());

              case 1:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      }));

      function removeFile() {
        return _removeFile.apply(this, arguments);
      }

      return removeFile;
    }(),
    removeDirectory: function () {
      var _removeDirectory = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt("return", mockRemoveDirectory());

              case 1:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15);
      }));

      function removeDirectory() {
        return _removeDirectory.apply(this, arguments);
      }

      return removeDirectory;
    }()
  };
});
describe('lib/simulation', function () {
  beforeEach(function () {
    mockPath.mockReset();
    mockAdd.mockReset();
    mockGet.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
    mockUserGet.mockReset();
    mockUserGet.mockImplementation(function () {
      return {};
    });
    mockUpdateProject.mockReset();
    mockGeometryGet.mockReset();
    mockReadFile.mockReset();
    mockWriteFile.mockReset();
    mockCopyFile.mockReset();
    mockConvert.mockReset();
    mockRemoveFile.mockReset();
    mockRemoveDirectory.mockReset();
    mockCompute.mockReset();
    mockStop.mockReset();
  });
  test('add', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
    var simulation;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            mockAdd.mockImplementation(function () {
              return {
                id: 'id'
              };
            });
            _context16.next = 3;
            return _["default"].add({
              project: {
                id: 'id'
              },
              simulation: {
                name: 'name',
                scheme: 'scheme'
              }
            });

          case 3:
            simulation = _context16.sent;
            expect(mockPath).toHaveBeenCalledTimes(0);
            expect(mockAdd).toHaveBeenCalledTimes(1);
            expect(mockGet).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockConvert).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(0);
            expect(simulation).toEqual({
              id: 'id'
            });

          case 15:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  })));
  test('get', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
    var simulation;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {};
            });
            _context17.next = 3;
            return _["default"].get('id', []);

          case 3:
            simulation = _context17.sent;
            expect(mockPath).toHaveBeenCalledTimes(0);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockConvert).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(0);
            expect(simulation).toEqual({});

          case 15:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  })));
  test('update', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {
                scheme: {
                  configuration: {
                    geometry: {}
                  }
                }
              };
            });
            _context18.next = 3;
            return _["default"].update({}, []);

          case 3:
            expect(mockPath).toHaveBeenCalledTimes(0);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(0);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockConvert).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(0);

          case 13:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  })));
  test('delete', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {};
            });
            _context19.next = 3;
            return _["default"].del({});

          case 3:
            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(1);
            expect(mockUpdateProject).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockConvert).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(1); // Remove directory error

            mockRemoveDirectory.mockImplementation(function () {
              throw new Error();
            });
            _context19.next = 16;
            return _["default"].del({}, {});

          case 16:
            expect(mockPath).toHaveBeenCalledTimes(2);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(0);
            expect(mockDelete).toHaveBeenCalledTimes(2);
            expect(mockUpdateProject).toHaveBeenCalledTimes(2);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockConvert).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(2);

          case 26:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  })));
  test('run', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            // Normal
            mockGet.mockImplementation(function () {
              return {
                scheme: {
                  configuration: {
                    geometry: {},
                    run: {
                      cloudServer: {
                        key: 'key'
                      }
                    }
                  }
                }
              };
            });
            mockUserGet.mockImplementation(function () {
              return {
                authorizedplugins: ['key']
              };
            });
            mockGeometryGet.mockImplementation(function () {
              return {
                uploadfilename: 'uploadfilename',
                extension: 'extension'
              };
            });
            _context20.next = 5;
            return _["default"].run({}, {});

          case 5:
            expect(mockPath).toHaveBeenCalledTimes(1);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(2);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockConvert).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(0);
            expect(mockCompute).toHaveBeenCalledTimes(1); // Error

            mockUpdate.mockReset();
            mockCompute.mockImplementation(function () {
              throw new Error();
            });
            _context20.next = 20;
            return _["default"].run({}, {});

          case 20:
            expect(mockPath).toHaveBeenCalledTimes(2);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockConvert).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(0);
            expect(mockCompute).toHaveBeenCalledTimes(2); // Unauthorized

            mockUserGet.mockImplementation(function () {
              return {
                authorizedplugins: []
              };
            });
            _context20.next = 34;
            return _["default"].run({}, {});

          case 34:
            expect(mockPath).toHaveBeenCalledTimes(2);
            expect(mockAdd).toHaveBeenCalledTimes(0);
            expect(mockGet).toHaveBeenCalledTimes(3);
            expect(mockUpdate).toHaveBeenCalledTimes(4);
            expect(mockDelete).toHaveBeenCalledTimes(0);
            expect(mockUpdateProject).toHaveBeenCalledTimes(0);
            expect(mockWriteFile).toHaveBeenCalledTimes(0);
            expect(mockConvert).toHaveBeenCalledTimes(0);
            expect(mockRemoveFile).toHaveBeenCalledTimes(0);
            expect(mockRemoveDirectory).toHaveBeenCalledTimes(0);
            expect(mockCompute).toHaveBeenCalledTimes(2);

          case 45:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  })));
  test('stop', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21() {
    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            mockGet.mockImplementation(function () {
              return {
                scheme: {
                  configuration: {
                    geometry: {},
                    run: {
                      cloudServer: {
                        key: 'key'
                      }
                    }
                  }
                },
                tasks: [{
                  status: 'wait'
                }, {
                  status: 'error'
                }]
              };
            });
            _context21.next = 3;
            return _["default"].stop({});

          case 3:
            expect(mockGet).toHaveBeenCalledTimes(1);
            expect(mockStop).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledTimes(1);

          case 6:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  })));
  test('getLog', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22() {
    var log;
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            mockReadFile.mockImplementation(function () {
              return 'log';
            });
            _context22.next = 3;
            return _["default"].getLog({
              id: 'id'
            }, 'log');

          case 3:
            log = _context22.sent;
            expect(mockReadFile).toHaveBeenCalledTimes(1);
            expect(log).toBe('log');

          case 6:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  })));
});