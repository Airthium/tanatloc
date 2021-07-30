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
 * FreeFEM service
 * @memberof module:services
 * @param {string} path Path
 * @param {string} script Script
 * @param {Function} callback Callback
 */
var freefem = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(path, script, callback) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var run;

              if ((0, _isDocker["default"])()) {
                run = (0, _child_process.spawn)('ff-mpirun', [' -np', '1', script, '-ns'], {
                  cwd: path
                });
              } else {
                var user = (0, _child_process.execSync)('id -u').toString().trim();
                var group = (0, _child_process.execSync)('id -g').toString().trim();
                run = (0, _child_process.spawn)('docker', ['run', '--rm', '--volume=' + path + ':/run', '--user=' + user + ':' + group, '-w=/run', 'tanatloc/worker:latest', 'ff-mpirun', '-np', '1', script, '-ns', '> log']);
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

  return function freefem(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = freefem;
exports["default"] = _default;