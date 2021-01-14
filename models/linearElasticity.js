/**
 * Linear elasticity
 * @memberof module:models
 */
const LinearElasticity = {
  category: 'Mechanics',
  name: 'Linear elasticity',
  algorithm: 'linearElasticity',
  code: 'FreeFEM',
  description: `
  <p>
    Linear elasticity
  </p>
  <p>
    <a target="_blank" href="https://en.wikipedia.org/wiki/Linear_elasticity">Wikipedia</a>
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
          label: "Young's modulus",
          name: 'E',
          htmlEntity: 'formula',
          default: 1e9,
          unit: '\\(Pa\\)'
        },
        {
          label: "Poisson's ratio",
          name: 'Nu',
          htmlEntity: 'formula',
          default: 0.4,
          unit: '\\(1\\)'
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
            unit: '\\(N.m^{-3}\\)'
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
      }
    },
    boundaryConditions: {
      index: 4,
      title: 'Boundary conditions',
      fixed: {
        label: 'Fixed',
        refineFactor: 10
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
        refineFactor: 10
      },
      pressure: {
        label: 'Surface force',
        children: [
          {
            label: 'd(U)/d(N)',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(N.m^{-2}\\)'
          }
        ],
        refineFactor: 5
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
      ]
    }
  }
}

export default LinearElasticity
