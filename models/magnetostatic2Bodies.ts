/** @module Models.Magnetostatic2Bodies */

import { IModel } from './index.d'

import description from './description/magnetostatic2Bodies'

/**
 * Magnetostatic for two bodies in contact
 */
const Magnetostatic2Bodies: IModel = {
  category: 'Electromagnetism',
  name: 'Magnetostatic 2 Bodies',
  algorithm: 'magnetostatic2Bodies',
  code: 'FreeFEM',
  version: '1.0.0',
  description,
  variables: [
    {
      label: 'Mesh 1',
      value: 'Mesh1'
    },
    {
      label: 'Mesh2',
      value: 'Mesh2'
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
    },
    {
      label: 'Rotational angle at each step',
      value: 'alpha'
    }
  ],
  configuration: {
    geometry: {
      index: 1,
      title: 'Geometries',
      children: [
        {
          label: 'Domain 1'
        },
        {
          label: 'Domain 2'
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
      current1: {
        label: 'Current 1',
        children: [
          {
            only3D: true,
            label: 'Current 1 (x)',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'A.m^{-2}' }],
            unit: { label: 'A.m^{-2}' }
          },
          {
            only3D: true,
            label: 'Current 1 (y)',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'A.m^{-2}' }],
            unit: { label: 'A.m^{-2}' }
          },
          {
            label: 'Current 1 (z)',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'A.m^{-2}' }],
            unit: { label: 'A.m^{-2}' }
          }
        ]
      },
      current2: {
        label: 'Current 2',
        children: [
          {
            only3D: true,
            label: 'Current 2 (x)',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'A.m^{-2}' }],
            unit: { label: 'A.m^{-2}' }
          },
          {
            only3D: true,
            label: 'Current 2 (y)',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: 'A.m^{-2}' }],
            unit: { label: 'A.m^{-2}' }
          },
          {
            label: 'Current 2 (z)',
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
      rotation: {
        label: 'Relative rotation',
        children: [
          {
            label: 'Total angle',
            htmlEntity: 'formula',
            default: '0',
            units: [{ label: '°' }],
            unit: { label: '°' }
          },
          {
            label: 'Step number',
            htmlEntity: 'formula',
            default: '1'
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
            label: ' Ad tangential(2D), Adx(3D) ',
            htmlEntity: 'formula',
            default: 0
          },
          {
            only3D: true,
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
            data: ['Ax1', 'Ay1', 'Az1'],
            data2D: 'Az1'
          },
          {
            name: 'Body_1_-_MagneticInduction',
            data: ['Bx1', 'By1', 'Bz1'],
            data2D: ['Bx1', 'By1', '0']
          },
          {
            name: 'Body_1_-_MagneticField',
            data: ['Hx1', 'Hy1', 'Hz1'],
            data2D: ['Hx1', 'Hy1', '0']
          }
        ],
        [
          {
            name: 'Body_2_-_VectorPotential',
            data: ['Ax2', 'Ay2', 'Az2'],
            data2D: 'Az2'
          },
          {
            name: 'Body_2_-_MagneticInduction',
            data: ['Bx2', 'By2', 'Bz2'],
            data2D: ['Bx2', 'By2', '0']
          },
          {
            name: 'Body_2_-_MagneticField',
            data: ['Hx2', 'Hy2', 'Hz2'],
            data2D: ['Hx2', 'Hy2', '0']
          }
        ]
      ],
      resultsFilter: {
        name: 'Angle step',
        prefixPattern: ['body1Result_', 'body2Result_'],
        suffixPattern: '.vtu',
        pattern: ['body1Result_\\d+.vtu', 'body2Result_\\d+.vtu']
      },
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
