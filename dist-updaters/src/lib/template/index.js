"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _ejs = _interopRequireDefault(require("ejs"));

var _tools = _interopRequireDefault(require("../tools"));

var _templates = _interopRequireDefault(require("../../../templates"));

var _templates2 = _interopRequireDefault(require("../../../plugins/templates"));

/** @module lib/template */

/**
 * Load templates
 */
var loadTemplates = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var templatesList;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            templatesList = {}; // Base templates

            _context4.next = 3;
            return Promise.all(Object.keys(_templates["default"]).map( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(key) {
                var content, func;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _tools["default"].readFile(_path["default"].join('./templates/', _templates["default"][key]));

                      case 2:
                        content = _context.sent;
                        _context.next = 5;
                        return _ejs["default"].compile(content.toString(), {
                          root: './templates'
                        });

                      case 5:
                        func = _context.sent;
                        templatesList[key] = func;

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 3:
            _context4.next = 5;
            return Promise.all(Object.keys(_templates2["default"]).map( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(key) {
                var plugin;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        plugin = _templates2["default"][key];
                        _context3.next = 3;
                        return Promise.all(plugin.templates.map( /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(template) {
                            var content, func;
                            return _regenerator["default"].wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _context2.next = 2;
                                    return _tools["default"].readFile(_path["default"].join(plugin.path, template.file));

                                  case 2:
                                    content = _context2.sent;
                                    _context2.next = 5;
                                    return _ejs["default"].compile(content.toString(), {
                                      root: './templates'
                                    });

                                  case 5:
                                    func = _context2.sent;
                                    templatesList[template.key] = func;

                                  case 7:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x3) {
                            return _ref4.apply(this, arguments);
                          };
                        }()));

                      case 3:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 5:
            return _context4.abrupt("return", templatesList);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function loadTemplates() {
    return _ref.apply(this, arguments);
  };
}();

var templates = [];
loadTemplates().then(function (res) {
  return templates = res;
})["catch"](function (err) {
  return console.warn(err);
});

var render = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(key, parameters, save) {
    var script;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return templates[key](parameters);

          case 2:
            script = _context5.sent;

            if (!save) {
              _context5.next = 6;
              break;
            }

            _context5.next = 6;
            return _tools["default"].writeFile(save.location, save.name, script);

          case 6:
            return _context5.abrupt("return", script);

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function render(_x4, _x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

var Template = {
  render: render
};
var _default = Template;
exports["default"] = _default;