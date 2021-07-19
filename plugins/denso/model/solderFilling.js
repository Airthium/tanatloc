/**
 * Solder filling
 */
const solderFilling = {
  category: 'Denso',
  name: 'Solder filling problem',
  algorithm: 'solderFilling',
  code: 'FreeFEM',
  version: '1.0.0',
  description: `
  <p>
    SolderFilling to find minimum volume of liquid that fills given gap in STEP geometry definition
    by incremental process with solving nonlinear optimization by gradient flow and Newton methods
  </p>
  `,
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
        children: [
          {
            label: 'Diffusion coefficient',
            htmlEntity: 'formula',
            default: '1e-4'
          }
        ]
      },
      cangle: {
        label: 'cangle',
        children: [
          {
            label: 'Contact angle',
            htmlEntity: 'formula',
            default: 40
          }
        ]
      },
      canglerestarted: {
        advanced: true,
        label: 'canglerestarted',
        children: [
          {
            label: 'contact angle of restarted data',
            htmlEntity: 'formula',
            default: 90
          }
        ]
      },
      pointsize: {
        advanced: true,
        label: 'pointsize',
        children: [
          {
            label: 'Size of the background mesh',
            htmlEntity: 'formula',
            default: 0.15
          }
        ]
      },
      hsizemag: {
        advanced: true,
        label: 'hsizemag',
        children: [
          {
            label: 'Magnitude of the finest mesh',
            htmlEntity: 'formula',
            default: 1.0
          }
        ]
      },
      nrestart: {
        advanced: true,
        label: 'nrestart',
        children: [
          {
            label: '#step to restart',
            htmlEntity: 'formula',
            default: 0
          }
        ]
      },
      countsweep: {
        advanced: true,
        label: 'countsweep',
        children: [
          {
            label: 'Number of steps for volume increment',
            htmlEntity: 'formula',
            default: 50
          }
        ]
      },
      continueflag: {
        advanced: true,
        label: 'continueflag',
        children: [
          {
            label: 'Flag to perform whole increments',
            htmlEntity: 'formula',
            default: 0
          }
        ]
      },
      volume: {
        advanced: true,
        label: 'Volume',
        children: [
          {
            label: 'Minimum ratio of volume increment',
            htmlEntity: 'formula',
            default: 1.012
          },
          {
            label: 'Maximum ratio of volume increment',
            htmlEntity: 'formula',
            default: 1.05
          }
        ]
      },
      newton: {
        advanced: true,
        label: 'Newton',
        children: [
          {
            label: '#Newton for gradient flow solver',
            htmlEntity: 'formula',
            default: 30
          },
          {
            label: '#Newton for stationary state solver',
            htmlEntity: 'formula',
            default: 60
          }
        ]
      },
      time: {
        advanced: true,
        label: 'Time',
        children: [
          {
            label: 'Time for initial gradient flow solver',
            htmlEntity: 'formula',
            default: 200
          },
          {
            label: 'Time for other gradient flow solvers',
            htmlEntity: 'formula',
            default: 500
          }
        ]
      },
      verbosityLevel: {
        advanced: true,
        label: 'verbosity flag',
        children: [
          {
            label: 'Verbosity level for debugging',
            htmlEntity: 'formula',
            default: 0
          }
        ]
      }
    },
    boundaryConditions: {
      index: 3,
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
      interface: {
        label: 'Interface'
      }
    },
    run: {
      index: 4,
      title: 'Run',
      logFile: 'jobname.log',
      results: [
        {
          name: 'phi'
        }
      ],
      resultsFilters: [
        {
          name: 'Time',
          prefixPattern: 'phi.',
          suffixPattern: '.vtu',
          pattern: 'phi.\\d+.vtu'
        }
      ]
    }
  }
}

export default solderFilling
