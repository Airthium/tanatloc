/**
 * Linear elasticity (time dependent)
 * @memberof Models
 */
const LinearElasticityTime = {
  category: 'Mechanics',
  name: 'Linear elasticity (time depedent)',
  algorithm: 'linearElasticityTime',
  code: 'FreeFEM',
  version: '1.0.0',
  description: `
  <h3>
    Linear elasticity (time dependent)
  </h3>
  <p>
  Let $\\Omega$ be a domain of $\\mathbb{R}^{d}$, with $d\\in\\{2,3\\}$.<br/>

  The domain $\\Omega$ is bounded by $\\Gamma = \\Gamma_D \\cup \\Gamma_N$.<br/>

  // TODO
  </p>
  <p>
    See <a target="_blank" href="https://en.wikipedia.org/wiki/Linear_elasticity">Wikipedia</a>.
  </p>
  `,
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
          default: 8050,
          unit: '$kg.m^{-3}'
        },
        {
          label: "Young's modulus",
          name: 'E',
          htmlEntity: 'formula',
          default: 1e9,
          unit: '$Pa$'
        },
        {
          label: "Poisson's ratio",
          name: 'Nu',
          htmlEntity: 'formula',
          default: 0.4,
          unit: '$1$'
        }
      ]
    },
    parameters: {
      index: 3,
      title: 'Parameters',
      rightHandSide: {
        label: 'Right hand side',
        children: [
          {
            label: 'External force (x)',
            htmlEntity: 'formula',
            default: 0,
            unit: '$N.m^{-3}$'
          },
          {
            label: 'External force (y)',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(N.m^{-3}\\)'
          },
          {
            label: 'External force (z)',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(N.m^{-3}\\)'
          }
        ]
      },
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
            label: '[Ux, Uy, Uz]',
            htmlEntity: 'select',
            options: [
              {
                label: 'P1',
                value: 'P1, P1, P1'
              },
              {
                label: 'P2',
                value: 'P2, P2, P2'
              }
            ],
            default: 'P1, P1, P1'
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
      },
      meshAdaptation: {
        advanced: true,
        label: 'Mesh adaptation',
        children: [
          {
            label: 'Enabled',
            htmlEntity: 'checkbox',
            default: false
          },
          {
            label: 'Number of mesh adaptation loops',
            htmlEntity: 'formula',
            default: 1
          }
        ]
      }
    },
    boundaryConditions: {
      index: 4,
      title: 'Boundary conditions',
      fixed: {
        label: 'Fixed',
        refineFactor: 2
      },
      displacement: {
        label: 'Displacement',
        children: [
          {
            label: 'Ux',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(m\\)'
          },
          {
            label: 'Uy',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(m\\)'
          },
          {
            label: 'Uz',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(m\\)'
          }
        ],
        refineFactor: 2
      },
      presure: {
        label: 'Surface force',
        children: [
          {
            label: 'd(U)/d(N)',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(N.m^{-2}\\)'
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
          name: 'U'
        },
        {
          name: 'vonMises'
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

export default LinearElasticityTime
