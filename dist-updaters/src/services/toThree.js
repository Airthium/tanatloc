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
 * toThree service
 * Convert mesh to threeJS
 * @memberof module:services
 * @param {string} path Path
 * @param {string} fileIn In file
 * @param {string} pathOut Out path
 */
var toThree = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(path, fileIn, pathOut) {
    var conversionCode, extension;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            conversionCode = ''; // Check extension

            extension = fileIn.split('.').pop();
            _context.t0 = extension.toLowerCase();
            _context.next = _context.t0 === 'step' ? 5 : _context.t0 === 'stp' ? 7 : _context.t0 === 'dxf' ? 9 : _context.t0 === 'msh' ? 11 : _context.t0 === 'vtu' ? 13 : 15;
            break;

          case 5:
            conversionCode = 'StepToThreeJS';
            return _context.abrupt("break", 16);

          case 7:
            conversionCode = 'StepToThreeJS';
            return _context.abrupt("break", 16);

          case 9:
            conversionCode = 'DXFToThreeJS';
            return _context.abrupt("break", 16);

          case 11:
            conversionCode = 'GmshToThreeJS';
            return _context.abrupt("break", 16);

          case 13:
            conversionCode = 'VTUToThreeJS';
            return _context.abrupt("break", 16);

          case 15:
            throw new Error('Unknown conversion code');

          case 16:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var run;
              var data = '';
              var error = '';

              if ((0, _isDocker["default"])()) {
                run = (0, _child_process.spawn)(conversionCode, [fileIn, pathOut], {
                  cwd: path
                });
              } else {
                var user = (0, _child_process.execSync)('id -u').toString().trim();
                var group = (0, _child_process.execSync)('id -g').toString().trim();
                run = (0, _child_process.spawn)('docker', ['run', '--volume=' + path + ':/three', '--user=' + user + ':' + group, '-w=/three', 'tanatloc/worker:latest', conversionCode, fileIn, pathOut]);
              }

              run.stdout.on('data', function (stdout) {
                stdout && (data += stdout.toString());
              });
              run.stderr.on('data', function (stderr) {
                stderr && (error += stderr.toString());
              });
              run.on('close', function (code) {
                resolve({
                  code: code,
                  data: data,
                  error: error
                });
              });
              run.on('error', function (err) {
                reject(err);
              });
            }));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function toThree(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = toThree;
exports["default"] = _default;