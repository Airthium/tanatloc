"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = _interopRequireDefault(require("../"));

jest.mock('ejs', function () {
  return {
    compile: function () {
      var _compile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", function () {
                  return 'ejs';
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function compile() {
        return _compile.apply(this, arguments);
      }

      return compile;
    }()
  };
});
var mockWriteFile = jest.fn();
jest.mock("../../tools", function () {
  return {
    readFile: function () {
      var _readFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", 'readFile');

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
    }()
  };
});
jest.mock("../../../../templates", function () {
  return {
    key: 'file'
  };
});
jest.mock("../../../../plugins/templates", function () {
  return {
    plugin: {
      key: 'key',
      path: 'path',
      templates: [{
        key: 'key',
        file: 'file'
      }]
    }
  };
});
describe('lib/template', function () {
  beforeEach(function () {
    mockWriteFile.mockReset();
  });
  test('render', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var script;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _["default"].render('key', {});

          case 2:
            script = _context4.sent;
            expect(script).toBe('ejs');
            expect(mockWriteFile).toHaveBeenCalledTimes(0); // With save

            _context4.next = 7;
            return _["default"].render('key', {}, {});

          case 7:
            script = _context4.sent;
            expect(script).toBe('ejs');
            expect(mockWriteFile).toHaveBeenCalledTimes(1);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
});