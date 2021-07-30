"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _urlJoin = _interopRequireDefault(require("url-join"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var call = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(configuration) {
    var platform, api, token, route, absoluteRoute, url, response, contentType, json, nextJson;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            platform = configuration.platform;
            api = '/api/v2/';
            token = configuration.token;
            route = configuration.route;
            absoluteRoute = configuration.absoluteRoute;
            url = absoluteRoute || (0, _urlJoin["default"])('https://', platform, api, route);
            _context.next = 8;
            return new Promise(function (resolve, reject) {
              (0, _nodeFetch["default"])(url, {
                method: configuration.method || 'GET',
                headers: _objectSpread({
                  Authorization: 'Token ' + token
                }, configuration.headers),
                body: configuration.body
              }).then(function (res) {
                return resolve(res);
              })["catch"](function (err) {
                return reject(err);
              });
            });

          case 8:
            response = _context.sent;
            contentType = response.headers.get('Content-Type');

            if (!(contentType === 'application/json')) {
              _context.next = 22;
              break;
            }

            _context.next = 13;
            return response.json();

          case 13:
            json = _context.sent;

            if (!json.next) {
              _context.next = 19;
              break;
            }

            _context.next = 17;
            return call(_objectSpread(_objectSpread({}, configuration), {}, {
              absoluteRoute: json.next
            }));

          case 17:
            nextJson = _context.sent;
            json.results = [].concat((0, _toConsumableArray2["default"])(json.results), (0, _toConsumableArray2["default"])(nextJson.results));

          case 19:
            return _context.abrupt("return", json);

          case 22:
            if (!(contentType === 'text/plain' || contentType === 'application/octet-stream')) {
              _context.next = 24;
              break;
            }

            return _context.abrupt("return", response.text());

          case 24:
            return _context.abrupt("return", response);

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function call(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = call;
exports["default"] = _default;