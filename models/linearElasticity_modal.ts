/**
 * Linear elasticity Modal analysis
 */
const LinearElasticityModal = {
  category: 'Mechanics',
  name: 'Linear elasticity - Modal analysis',
  algorithm: 'linearElasticityModal',
  code: 'FreeFEM',
  sequential: true,
  version: '1.0.0',
  description: '',
  variables: [
    {
      name: 'Displacement (x)',
      value: 'Ux'
    },
    {
      name: 'Displacement (y)',
      value: 'Uy'
    },
    {
      name: 'Displacement (z)',
      value: 'Uz'
    }
  ],
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
          default: 8050,
          unit: '\\(kg.m^{-3}\\)'
        },
        {
          label: "Young's modulus",
          name: 'E',
          htmlEntity: 'formula',
          default: 1e4,
          unit: '\\(Pa\\)'
        },
        {
          label: "Poisson's ratio",
          name: 'Nu',
          htmlEntity: 'formula',
          default: 0.3,
          unit: '\\(1\\)'
        }
      ]
    },
    parameters: {
      index: 3,
      title: 'Parameters',
      modalparameters: {
        label: 'Modal parameters',
        children: [
          {
            label: 'sigma',
            htmlEntity: 'formula',
            default: 0
          },
          {
            label: 'Eigenvectors number ',
            htmlEntity: 'formula',
            default: 4
          }
        ]
      },
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        children: [
          {
            label: '[Ux, Uy, Uz]',
            label2D: '[Ux, Uy]',
            htmlEntity: 'select',
            options: [
              {
                label: 'P1',
                value: 'P1, P1, P1',
                value2D: 'P1, P1'
              },
              {
                label: 'P2',
                value: 'P2, P2, P2',
                value2D: 'P2, P2'
              }
            ],
            default: 'P1, P1, P1',
            default2D: 'P1, P1'
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
      }
    },
    run: {
      index: 5,
      title: 'Run',
      results: [
        {
          name: 'Displacement'
        }
      ],
      resultsFilter: {
        name: 'Mode number',
        prefixPattern: 'Result_',
        suffixPattern: '.vtu',
        pattern: 'Result_\\d+.vtu'
      },
      postprocessing: [
        {
          key: 'warpByVector',
          parameters: [{ key: 'Vectors', value: 'Displacement' }]
        },
        {
          key: 'contour',
          parameters: [
            {
              key: 'ContourBy',
              options: ['Displacement']
            }
          ]
        }
      ]
    }
  }
}

export default LinearElasticityModal
