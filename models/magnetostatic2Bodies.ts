/** @module Models.Magnetostatic2Bodies */

import { IModel } from './index.d'

import description from './description/magnetostatic2Bodies'

const Magnetostatic2Bodies: IModel = {
  category: 'Electromagnetism',
  name: 'Magnetostatic 2 Bodies',
  algorithm: 'magnetostatic2Bodies',
  code: 'FreeFEM',
  version: '1.0.0',
  description,
  variables: [
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
      title: 'Geometries',
      meshable: true,
      multiple: true,
      n: 2
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
            default: '1e10'
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
      },
      contactArea: {
        label: 'Contact areas'
      }
    },
    run: {
      index: 5,
      title: 'Run',
      results: [
        [
          {
            name: 'Body_1_-_VectorPotential',
            data: ['Ax', 'Ay', 'Az'],
            data2D: 'Az'
          },
          {
            name: 'Body_1_-_MagneticInduction',
            data: ['Bx', 'By', 'Bz'],
            data2D: 'B'
          },
          {
            name: 'Body_1_-_MagneticField',
            data: ['Hx', 'Hy', 'Hz'],
            data2D: 'H'
          }
        ],
        [
          {
            name: 'Body_2_-_VectorPotential',
            data: ['Ax', 'Ay', 'Az'],
            data2D: 'Az'
          },
          {
            name: 'Body_2_-_MagneticInduction',
            data: ['Bx', 'By', 'Bz'],
            data2D: 'B'
          },
          {
            name: 'Body_2_-_MagneticField',
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

export default Magnetostatic2Bodies
