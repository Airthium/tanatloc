/** @module Models.LinearElasticityTime */

import { IModel } from './index.d'

import description from './description/magnetostatic'

/**
 * Magnetostatic
 */
const Magnetostatic: IModel = {
  category: 'Electromagnetism',
  name: 'Magnetostatic',
  algorithm: 'magnetostatic',
  code: 'FreeFEM',
  version: '1.0.0',
  description,
  variables: [
    {
      label: 'Mesh',
      value: 'Mesh'
    },
    {
      only3D: true,
      label: 'Magnetic vector potential (x)',
      value: 'Ax'
    },
    {
      only3D: true,
      label: 'Magnetic vector potential (y)',
      value: 'Ay'
    },
    {
      label: 'Magnetic vector potential (z)',
      value: 'Az'
    }
  ],
  configuration: {
    geometry: {
      index: 1,
      title: 'Geometry',
      children: [
        {
          label: 'Domain',
          meshable: true,
          limit: 1
        }
      ]
    },
    materials: {
      index: 2,
      title: 'Materials',
      children: [
        {
          label: 'Magnetic permeability',
          name: 'Mu',
          htmlEntity: 'formula',
          default: '4*pi*1e-7',
          units: [{ label: 'H.m^{-1}' }],
          unit: { label: 'H.m^{-1}' }
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
            default: '0',
            units: [{ label: 'A.m^{-2}' }],
            unit: { label: 'A.m^{-2}' }
          },
          {
            only3D: true,
            label: 'Current (y)',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'A.m^{-2}' }],
            unit: { label: 'A.m^{-2}' }
          },
          {
            label: 'Current (z)',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'A.m^{-2}' }],
            unit: { label: 'A.m^{-2}' }
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
            label: '[Ax, Ay, Az]',
            label2D: '[Az]',
            htmlEntity: 'select',
            options: [
              {
                label: 'P1',
                value: 'P1, P1, P1',
                value2D: 'P1'
              },
              {
                label: 'P2',
                value: 'P2, P2, P2',
                value2D: 'P2'
              }
            ],
            default: 'P1, P1, P1',
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
