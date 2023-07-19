/** @module Models.LinearElasticity */

import { IModel } from './index.d'

import description from './description/linearElasticity'

/**
 * Linear elasticity
 */
const LinearElasticity: IModel = {
  category: 'Mechanics',
  name: 'Linear elasticity',
  algorithm: 'linearElasticity',
  code: 'FreeFEM',
  version: '1.0.0',
  description,
  variables: [
    {
      label: 'Displacement (x)',
      value: 'Ux'
    },
    {
      label: 'Displacement (y)',
      value: 'Uy'
    },
    {
      label: 'Displacement (z)',
      value: 'Uz',
      only3D: true
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
            { label: 'kg.m^{-3}' },
            { label: 'g.mm^{-3}', multiplicator: 1e6 }
          ],
          unit: { label: 'kg.m^{-3}' }
        },
        {
          label: "Young's modulus",
          name: 'E',
          htmlEntity: 'formula',
          default: '1e9',
          units: [
            { label: 'Pa' },
            { label: 'kPa', multiplicator: 1e-3 },
            { label: 'MPa', multiplicator: 1e-6 },
            { label: 'GPa', multiplicator: 1e-9 }
          ],
          unit: { label: 'Pa' }
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
              { label: 'N.m^{-3}' },
              { label: 'N.mm^{-3}', multiplicator: 1e9 }
            ],
            unit: { label: 'N.m^{-3}' }
          },
          {
            label: 'External force (y)',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'N.m^{-3}' },
              { label: 'N.mm^{-3}', multiplicator: 1e9 }
            ],
            unit: { label: 'N.m^{-3}' }
          },
          {
            only3D: true,
            label: 'External force (z)',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'N.m^{-3}' },
              { label: 'N.mm^{-3}', multiplicator: 1e9 }
            ],
            unit: { label: 'N.m^{-3}' }
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
            units: [{ label: 'm.s^{-2}' }],
            unit: { label: 'm.s^{-2}' }
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
            units: [{ label: 'm' }, { label: 'mm', multiplicator: 1e3 }],
            unit: { label: 'm' }
          },
          {
            label: 'Uy',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'm' }, { label: 'mm', multiplicator: 1e3 }],
            unit: { label: 'm' }
          },
          {
            only3D: true,
            label: 'Uz',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'm' }, { label: 'mm', multiplicator: 1e3 }],
            unit: { label: 'm' }
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
            units: [{ label: 'N.m^{-2}' }],
            unit: { label: 'N.m^{-2}' }
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
            units: [{ label: 'N.m^{-2}' }],
            unit: { label: 'N.m^{-2}' }
          },
          {
            label: 'y',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'N.m^{-2}' }],
            unit: { label: 'N.m^{-2}' }
          },
          {
            label: 'z',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'N.m^{-2}' }],
            unit: { label: 'N.m^{-2}' }
          }
        ]
      }
    },
    run: {
      index: 5,
      title: 'Run',
      results: [
        [
          {
            name: 'Displacement',
            data: ['Ux', 'Uy', 'Uz'],
            data2D: ['Ux', 'Uy', '0'],
            units: [{ label: 'm' }, { label: 'mm', multiplicator: 1e3 }],
            unit: { label: 'm' }
          },
          {
            name: 'vonMises',
            data: 'Sigma',
            units: [
              { label: 'Pa' },
              { label: 'kPa', multiplicator: 1e-3 },
              { label: 'MPa', multiplicator: 1e-6 },
              { label: 'GPa', multiplicator: 1e-9 }
            ],
            unit: { label: 'Pa' }
          },
          {
            name: 'gamma11',
            data: 'gamma11',
            units: [
              { label: 'Pa' },
              { label: 'kPa', multiplicator: 1e-3 },
              { label: 'MPa', multiplicator: 1e-6 },
              { label: 'GPa', multiplicator: 1e-9 }
            ],
            unit: { label: 'Pa' }
          },
          {
            name: 'gamma12',
            data: 'gamma12',
            units: [
              { label: 'Pa' },
              { label: 'kPa', multiplicator: 1e-3 },
              { label: 'MPa', multiplicator: 1e-6 },
              { label: 'GPa', multiplicator: 1e-9 }
            ],
            unit: { label: 'Pa' }
          },
          {
            name: 'gamma13',
            data: 'gamma13',
            units: [
              { label: 'Pa' },
              { label: 'kPa', multiplicator: 1e-3 },
              { label: 'MPa', multiplicator: 1e-6 },
              { label: 'GPa', multiplicator: 1e-9 }
            ],
            unit: { label: 'Pa' }
          },
          {
            name: 'gamma22',
            data: 'gamma22',
            units: [
              { label: 'Pa' },
              { label: 'kPa', multiplicator: 1e-3 },
              { label: 'MPa', multiplicator: 1e-6 },
              { label: 'GPa', multiplicator: 1e-9 }
            ],
            unit: { label: 'Pa' }
          },
          {
            name: 'gamma23',
            data: 'gamma23',
            units: [
              { label: 'Pa' },
              { label: 'kPa', multiplicator: 1e-3 },
              { label: 'MPa', multiplicator: 1e-6 },
              { label: 'GPa', multiplicator: 1e-9 }
            ],
            unit: { label: 'Pa' }
          },
          {
            name: 'gamma33',
            data: 'gamma33',
            units: [
              { label: 'Pa' },
              { label: 'kPa', multiplicator: 1e-3 },
              { label: 'MPa', multiplicator: 1e-6 },
              { label: 'GPa', multiplicator: 1e-9 }
            ],
            unit: { label: 'Pa' }
          }
        ]
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
