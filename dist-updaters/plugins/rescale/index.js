"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _components = _interopRequireDefault(require("./src/components"));

var Rescale = {
  category: 'HPC',
  key: 'rescale',
  name: 'Rescale plugin',
  logo: '/images/rescale.svg',
  description: '<p><a target="_blank" href="https://www.rescale.com/">Rescale</a>: Intelligent HPC Platform</p>',
  configuration: {
    name: {
      required: true,
      label: 'Name',
      type: 'input'
    },
    token: {
      required: true,
      label: 'Token',
      type: 'password'
    },
    platform: {
      required: true,
      label: 'Platform',
      type: 'select',
      options: ['platform.rescale.com', 'eu.rescale.com', 'platform.rescale.jp']
    },
    walltime: {
      label: 'Default walltime (hours)',
      type: 'input',
      "default": '48'
    },
    organization: {
      label: 'Organization name',
      type: 'input'
    },
    project: {
      label: 'Project id',
      type: 'input'
    },
    additionalFiles: {
      label: 'Additional files (id1, id2, ...)',
      type: 'input'
    }
  },
  needInit: true,
  data: {
    coreTypes: [],
    freefem: {},
    walltime: 48
  },
  renderer: _components["default"],
  inUseConfiguration: {
    coreTypes: {
      label: 'Core type'
    },
    numberOfCores: {
      label: 'Number of cores'
    },
    lowPriority: {
      label: 'Low priority'
    },
    freefemVersion: {
      label: 'FreeFEM version'
    },
    walltime: {
      label: 'Walltime'
    }
  }
};
var _default = Rescale;
exports["default"] = _default;