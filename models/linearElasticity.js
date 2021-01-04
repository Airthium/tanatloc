/**
 * Linear elasticity
 * @memberof module:models
 */
const LinearElasticity = {
  category: 'Mechanics',
  name: 'Linear elasticity',
  algorithm: 'linearElasticity',
  code: 'FreeFEM',
  description: '',
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
          htmlEntity: '',
          default: 1e9
        },
        {
          label: "Poisson's ratio",
          htmlEntity: '',
          default: 0.4
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
            default: 0
          },
          {
            label: 'External force (y)',
            htmlEntity: 'formula',
            default: 0
          },
          {
            label: 'External force (z)',
            htmlEntity: 'formula',
            default: 0
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
        label: 'Fixed'
      },
      displacement: {
        label: 'Displacement',
        children: [
          {
            label: 'Ux',
            default: 0
          },
          {
            label: 'Uy',
            default: 0
          },
          {
            label: 'Uz',
            default: 0
          }
        ]
      },
      pressure: {
        label: 'Pressure',
        children: [
          {
            label: 'U * N',
            default: 0
          }
        ]
      }
    },
    run: {
      index: 4,
      title: 'Run',
      results: [
        {
          name: 'u'
        }
      ]
    }
  }
}

export default LinearElasticity
