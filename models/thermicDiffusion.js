/**
 * Thermic diffusion
 * @memberof Models
 */
const ThermicDiffusion = {
  category: 'Thermic',
  name: 'Thermal diffusion',
  algorithm: 'thermicDiffusion',
  code: 'FreeFEM',
  version: '1.0.0',
  description: `TODO`,
  configuration: {
    geometry: {
      index: 1,
      title: 'Geometry',
      meshable: true
    },
    materials: {
      index: 2,
      title: 'Materials',
      children: [
        {
          label: 'Density',
          name: 'Rho',
          htmlEntity: 'formula',
          default: 7960,
          unit: '$kg.m^{-3}$'
        },
        {
          label: 'Thermal conductivity',
          name: 'Lambda',
          htmlEntity: 'formula',
          default: 15,
          unit: '$W.m^{-1}.K^{-1}$'
        },
        {
          label: 'Heat capacity',
          name: 'Cp',
          htmlEntity: 'formula',
          default: 502,
          unit: '$J.K^{-1}.kg^{-1}$'
        }
      ]
    },
    parameters: {
      index: 3,
      title: 'Parameters',
      time: {
        label: 'Time',
        children: [
          {
            label: 'Total time',
            htmlEntity: 'formula',
            default: 1,
            unit: '$s$'
          },
          {
            label: 'Time step',
            htmlEntity: 'formula',
            default: 0.1,
            unit: '$s$'
          }
        ]
      },
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        children: [
          {
            label: 'T',
            htmlEntity: 'select',
            options: [
              {
                label: 'P1',
                value: 'P1'
              },
              {
                label: 'P2',
                value: 'P2'
              }
            ],
            default: 'P1'
          }
        ]
      },
      solver: {
        advanced: true,
        label: 'Solver',
        children: [
          {
            label: 'System resolution',
            htmlEntity: 'select',
            options: [
              { label: 'GMRES', value: 'GMRES' },
              { label: 'MUMPS', value: 'MUMPS' },
              { label: 'UMFPACK', value: 'UMFPACK' }
            ],
            default: 'MUMPS'
          }
        ]
      }
    },
    boundaryConditions: {
      index: 4,
      title: 'Boundary conditions',
      temperature: {
        label: 'Temperature',
        children: [
          {
            label: 'T',
            htmlEntity: 'formula',
            default: 0,
            unit: 'K'
          }
        ],
        refineFactor: 2
      }
    },
    run: {
      index: 5,
      title: 'Run',
      results: [
        {
          name: 'T'
        }
      ],
      resultsFilters: [
        {
          name: 'Time',
          prefixPattern: 'Result_',
          suffixPattern: '.vtu',
          pattern: 'Result_\\d+.vtu',
          multiplicator: ['parameters', 'time', 'children', '1']
        }
      ]
    }
  }
}

export default ThermicDiffusion
