"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _components = _interopRequireDefault(require("./src/components"));

var Local = {
  category: 'HPC',
  key: 'local',
  name: 'Local',
  description: '<p>Local</p>',
  configuration: {
    name: {
      label: 'Name',
      type: 'input'
    }
  },
  renderer: _components["default"],
  inUseConfiguration: {}
};
var _default = Local;
exports["default"] = _default;