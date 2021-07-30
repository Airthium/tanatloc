"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Solder filling
 */
var solderFilling = {
  category: 'Denso',
  name: 'Solder filling problem',
  algorithm: 'solderFilling',
  code: 'FreeFEM',
  version: '1.0.0',
  description: "\n  <p>\n    SolderFilling to find minimum volume of liquid that fills given gap in STEP geometry definition\n    by incremental process with solving nonlinear optimization by gradient flow and Newton methods\n  </p>\n  ",
  configuration: {
    geometry: {
      index: 1,
      title: 'Geometry',
      meshable: false
    },
    parameters: {
      index: 2,
      title: 'Parameters',
      kappa: {
        advanced: true,
        label: 'kappa',
        children: [{
          label: 'Diffusion coefficient',
          htmlEntity: 'formula',
          "default": '1e-4'
        }]
      },
      cangle: {
        label: 'cangle',
        children: [{
          label: 'Contact angle',
          htmlEntity: 'formula',
          "default": 40
        }]
      },
      canglerestarted: {
        advanced: true,
        label: 'canglerestarted',
        children: [{
          label: 'contact angle of restarted data',
          htmlEntity: 'formula',
          "default": 90
        }]
      },
      pointsize: {
        advanced: true,
        label: 'pointsize',
        children: [{
          label: 'Size of the background mesh',
          htmlEntity: 'formula',
          "default": 0.15
        }]
      },
      hsizemag: {
        advanced: true,
        label: 'hsizemag',
        children: [{
          label: 'Magnitude of the finest mesh',
          htmlEntity: 'formula',
          "default": 1.0
        }]
      },
      nrestart: {
        advanced: true,
        label: 'nrestart',
        children: [{
          label: '#step to restart',
          htmlEntity: 'formula',
          "default": 0
        }]
      },
      countsweep: {
        advanced: true,
        label: 'countsweep',
        children: [{
          label: 'Number of steps for volume increment',
          htmlEntity: 'formula',
          "default": 50
        }]
      },
      continueflag: {
        advanced: true,
        label: 'continueflag',
        children: [{
          label: 'Flag to perform whole increments',
          htmlEntity: 'formula',
          "default": 0
        }]
      },
      volume: {
        advanced: true,
        label: 'Volume',
        children: [{
          label: 'Minimum ratio of volume increment',
          htmlEntity: 'formula',
          "default": 1.012
        }, {
          label: 'Maximum ratio of volume increment',
          htmlEntity: 'formula',
          "default": 1.05
        }]
      },
      newton: {
        advanced: true,
        label: 'Newton',
        children: [{
          label: '#Newton for gradient flow solver',
          htmlEntity: 'formula',
          "default": 30
        }, {
          label: '#Newton for stationary state solver',
          htmlEntity: 'formula',
          "default": 60
        }]
      },
      time: {
        advanced: true,
        label: 'Time',
        children: [{
          label: 'Time for initial gradient flow solver',
          htmlEntity: 'formula',
          "default": 200
        }, {
          label: 'Time for other gradient flow solvers',
          htmlEntity: 'formula',
          "default": 500
        }]
      },
      verbosityLevel: {
        advanced: true,
        label: 'verbosity flag',
        children: [{
          label: 'Verbosity level for debugging',
          htmlEntity: 'formula',
          "default": 0
        }]
      }
    },
    initialization: {
      index: 3,
      title: 'Initialization',
      done: true,
      coupling: {
        label: 'Coupling',
        compatibility: [{
          algorithm: 'solderFilling',
          filter: {
            name: 'Step',
            prefixPattern: 'phi.',
            suffixPattern: '.vtu',
            pattern: 'phi.\\d+.vtu'
          }
        }]
      }
    },
    boundaryConditions: {
      index: 4,
      title: 'Boundary conditions',
      wall: {
        label: 'Wall'
      },
      wet: {
        label: 'Wet'
      },
      liquid: {
        label: 'Liquid'
      },
      "interface": {
        label: 'Interface'
      }
    },
    run: {
      index: 5,
      title: 'Run',
      logFile: 'jobname.log',
      results: [{
        name: 'phi'
      }],
      resultsFilters: [{
        name: 'Time',
        prefixPattern: 'phi.',
        suffixPattern: '.vtu',
        pattern: 'phi.\\d+.vtu'
      }]
    }
  }
};
var _default = solderFilling;
exports["default"] = _default;