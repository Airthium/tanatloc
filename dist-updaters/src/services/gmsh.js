"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _child_process = require("child_process");

var _isDocker = _interopRequireDefault(require("is-docker"));

/**
 * Gmsh service
 * @memberof module:services
 * @param {string} path Path
 * @param {string} fileIn In file
 * @param {string} fileOut Out file
 * @param {Function} callback Callback
 */
var gmsh = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(path, fileIn, fileOut, callback) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var run;

              if ((0, _isDocker["default"])()) {
                run = (0, _child_process.spawn)('gmsh', ['-3', fileIn, '-o', fileOut, '-format', 'msh2', '-clcurv', '10'], {
                  cwd: path
                });
              } else {
                var user = (0, _child_process.execSync)('id -u').toString().trim();
                var group = (0, _child_process.execSync)('id -g').toString().trim();
                run = (0, _child_process.spawn)('docker', ['run', '--volume=' + path + ':/mesh', '--user=' + user + ':' + group, '-w=/mesh', 'tanatloc/worker:latest', 'gmsh', '-3', fileIn, '-o', fileOut, '-format', 'msh2', '-clcurv', '10']);
              }

              callback({
                pid: run.pid
              });
              run.stdout.on('data', function (data) {
                callback({
                  data: data.toString()
                });
              });
              run.stderr.on('data', function (data) {
                callback({
                  error: data.toString()
                });
              });
              run.on('close', function (code) {
                resolve(code);
              });
              run.on('error', function (err) {
                reject(err);
              });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function gmsh(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var _default = gmsh;
exports["default"] = _default;