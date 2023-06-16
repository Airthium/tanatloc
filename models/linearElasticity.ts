/** @module Models.LinearElasticity */

import { IModel } from './index.d'

/**
 * Linear elasticity
 */
const LinearElasticity: IModel = {
  category: 'Mechanics',
  name: 'Linear elasticity',
  algorithm: 'linearElasticity',
  code: 'FreeFEM',
  version: '1.0.0',
  description: `
  <h3>
    Linear elasticity
  </h3>
  <p>
  Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>

  The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>

    \\(u\\) is the displacement.<br/>

  The linear elasticity equation reads as follow:

  $$
  \\begin{align}
    -\\text{div}(\\sigma) &= f &\\text{on }\\Omega\\\\
    u &= u_D&\\text{on }\\Gamma_D\\\\
    \\sigma\\cdot n &= u_N&\\text{on }\\Gamma_N
  \\end{align}
  $$

  With \\(\\sigma_{ij}(u) = \\lambda\\delta_{ij}\\nabla\\cdot u + 2\\mu\\epsilon_{ij}(u)\\).<br/>

  \\(\\lambda\\) and \\(\\mu\\) are the Lamé coefficients.
  </p>
  <figure>
    <img src="/images/LinearElasticity.png" alt="Linear Elasticity" />
    <figcaption>Linear elasticity equation example on a beam.</figcaption>
  </figure>
  <p>
    See <a target="_blank" href="https://en.wikipedia.org/wiki/Linear_elasticity">Wikipedia</a>.
  </p>
  `,
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
          default: '8050',
          units: [
            { label: 'kg.m^{-3}', multiplicator: 1 },
            { label: 'g.mm^{-3}', multiplicator: 1e6 }
          ],
          unit: { label: 'kg.m^{-3}', multiplicator: 1 }
        },
        {
          label: "Young's modulus",
          name: 'E',
          htmlEntity: 'formula',
          default: '1e9',
          units: [
            { label: 'Pa', multiplicator: 1 },
            { label: 'kPa', multiplicator: 1e3 },
            { label: 'MPa', multiplicator: 1e6 },
            { label: 'GPa', multiplicator: 1e9 }
          ],
          unit: { label: 'Pa', multiplicator: 1 }
        },
        {
          label: "Poisson's ratio",
          name: 'Nu',
          htmlEntity: 'formula',
          default: '0.4'
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
            default: '0',
            units: [
              { label: 'N.m^{-3}', multiplicator: 1 },
              { label: 'N.mm^{-3}', multiplicator: 1e-3 }
            ],
            unit: { label: 'N.m^{-3}', multiplicator: 1 }
          },
          {
            label: 'External force (y)',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'N.m^{-3}', multiplicator: 1 },
              { label: 'N.mm^{-3}', multiplicator: 1e-3 }
            ],
            unit: { label: 'N.m^{-3}', multiplicator: 1 }
          },
          {
            only3D: true,
            label: 'External force (z)',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'N.m^{-3}', multiplicator: 1 },
              { label: 'N.mm^{-3}', multiplicator: 1e-3 }
            ],
            unit: { label: 'N.m^{-3}', multiplicator: 1 }
          }
        ]
      },
      gravity: {
        advanced: true,
        label: 'Gravity',
        children: [
          {
            label: 'Standard gravity',
            htmlEntity: 'formula',
            default: '9.81',
            units: [{ label: 'm.s^{-2}', multiplicator: 1 }],
            unit: { label: 'm.s^{-2}', multiplicator: 1 }
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
            default: '0',
            units: [
              { label: 'm', multiplicator: 1 },
              { label: 'mm', multiplicator: 1e3 }
            ],
            unit: { label: 'm', multiplicator: 1 }
          },
          {
            label: 'Uy',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'm', multiplicator: 1 },
              { label: 'mm', multiplicator: 1e3 }
            ],
            unit: { label: 'm', multiplicator: 1 }
          },
          {
            only3D: true,
            label: 'Uz',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'm', multiplicator: 1 },
              { label: 'mm', multiplicator: 1e3 }
            ],
            unit: { label: 'm', multiplicator: 1 }
          }
        ],
        refineFactor: 2
      },
      presure: {
        label: 'Surface force (normal)',
        children: [
          {
            label: 'd(U)/d(N)',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'N.m^{-2}', multiplicator: 1 }],
            unit: { label: 'N.m^{-2}', multiplicator: 1 }
          }
        ],
        refineFactor: 2
      },
      componentsPresure: {
        label: 'Surface force (components)',
        children: [
          {
            label: 'x',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'N.m^{-2}', multiplicator: 1 }],
            unit: { label: 'N.m^{-2}', multiplicator: 1 }
          },
          {
            label: 'y',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'N.m^{-2}', multiplicator: 1 }],
            unit: { label: 'N.m^{-2}', multiplicator: 1 }
          },
          {
            label: 'z',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'N.m^{-2}', multiplicator: 1 }],
            unit: { label: 'N.m^{-2}', multiplicator: 1 }
          }
        ]
      }
    },
    run: {
      index: 5,
      title: 'Run',
      results: [
        {
          name: 'Displacement'
        },
        {
          name: 'vonMises'
        },
        {
          name: 'gamma11'
        },
        {
          name: 'gamma12'
        },
        {
          name: 'gamma13'
        },
        {
          name: 'gamma22'
        },
        {
          name: 'gamma23'
        },
        {
          name: 'gamma33'
        }
      ],
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
              options: [
                'Displacement',
                'vonMises',
                'gamma11',
                'gamma12',
                'gamma13',
                'gamma22',
                'gamma23',
                'gamma33'
              ]
            }
          ]
        }
      ]
    }
  }
}

export default LinearElasticity
