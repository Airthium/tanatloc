/** @module Models.LinearElasticityModal */

import { IModel } from './index.d'

import description from './description/linearElasticityModal'

/**
 * Linear elasticity Modal analysis
 */
const LinearElasticityModal: IModel = {
  category: 'Mechanics',
  name: 'Linear elasticity - Modal analysis',
  algorithm: 'linearElasticityModal',
  code: 'FreeFEM',
  sequential: true,
  version: '1.0.0',
  description,
  variables: [
    {
      label: 'Mesh',
      value: 'Mesh'
    },
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
      children: [
        {
          label: 'Domain'
        }
      ]
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
          default: '1e4',
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
          default: '0.3'
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
            default: '0'
          },
          {
            label: 'Eigenvectors number ',
            htmlEntity: 'formula',
            default: '4'
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
      free: {
        label: 'Free'
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
            label: 'Uz',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'm' }, { label: 'mm', multiplicator: 1e3 }],
            unit: { label: 'm' }
          }
        ],
        refineFactor: 2
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
          }
        ]
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
