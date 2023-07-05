/** @module Models.LinearElasticityTime */

import { IModel } from './index.d'

import description from './description/magnetostatic'

/**
 * Magnetostatic
 */
const Magnetostatic: IModel = {
  category: 'Electromagntism',
  name: 'Magnetostatic',
  algorithm: 'magnetostatic',
  code: 'FreeFEM',
  version: '1.0.0',
  description,
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
          label: 'Magnetic permeability',
          name: 'Mu',
          htmlEntity: 'formula',
          default: '4*pi*1e-7'
        }
      ]
    },
    parameters: {
      index: 3,
      title: 'Parameters',
      current: {
        label: 'Current',
        children: [
          {
            only3D: true,
            label: 'Current (x)',
            htmlEntity: 'formula',
            default: '0'
          },
          {
            only3D: true,
            label: 'Current (y)',
            htmlEntity: 'formula',
            default: '0'
          },
          {
            label: 'Current (z)',
            htmlEntity: 'formula',
            default: '0'
          }
        ]
      },
      penalty: {
        label: 'Penalisation',
        children: [
          {
            label: 'Penalty factor',
            htmlEntity: 'formula',
            default: '1e6'
          }
        ]
      },
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space H(curl)',
        children: [
          {
            label: '[Ux, Uy, Uz]',
            label2D: '[Ux, Uy]',
            htmlEntity: 'select',
            options: [
              {
                label: 'P1',
                value: ' ',
                value2D: 'P1'
              },
              {
                label: 'Nedelec',
                value: 'Edge03d, Edge03d, Edge03d',
                value2D: 'RT0Ortho'
              }
            ],
            default: 'Edge03d, Edge03d, Edge03d',
            default2D: 'P1'
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
      dirichlet: {
        label: 'Dirichlet',
        children: [
          {
            only3D: true,
            label: 'Ax',
            htmlEntity: 'formula',
            default: 0
          },
          {
            only3D: true,
            label: 'Ay',
            htmlEntity: 'formula',
            default: 0
          },
          {
            label: 'Az',
            htmlEntity: 'formula',
            default: 0
          }
        ]
      },
      dirichletProd: {
        label: 'A x n = Ad',
        children: [
          {
            label: 'Adx ',
            htmlEntity: 'formula',
            default: 0
          },
          {
            label: 'Ady',
            htmlEntity: 'formula',
            default: 0
          },
          {
            only3D: true,
            label: 'Adz',
            htmlEntity: 'formula',
            default: 0
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
            name: 'VectorPotential',
            data: ['Ax', 'Ay', 'Az'],
            data2D: 'Az'
          },
          {
            name: 'MagneticInduction',
            data: ['Bx', 'By', 'Bz'],
            data2D: 'B'
          },
          {
            name: 'MagneticField',
            data: ['Hx', 'Hy', 'Hz'],
            data2D: 'H'
          }
        ]
      ],
      postprocessing: [
        {
          key: 'streamTracer',
          parameters: [
            {
              key: 'Vectors',
              value: 'MagneticInduction'
            }
          ]
        }
      ]
    }
  }
}

export default Magnetostatic