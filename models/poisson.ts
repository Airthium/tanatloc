/** @module Models.Poisson */

import { IModel } from './index.d'

import description from './description/poisson'

/**
 * Poisson's equation
 */
const Poisson: IModel = {
  category: 'Academic',
  name: "Poisson's equation",
  algorithm: 'poisson',
  code: 'FreeFEM',
  version: '1.0.0',
  description,
  variables: [
    {
      label: 'Mesh',
      value: 'Mesh'
    },
    {
      label: 'u',
      value: 'u'
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
    parameters: {
      index: 2,
      title: 'Parameters',
      rightHandSide: {
        label: 'Right hand side',
        children: [
          {
            label: 'External force',
            htmlEntity: 'formula',
            default: '0'
          }
        ]
      },
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        children: [
          {
            label: 'u',
            htmlEntity: 'select',
            options: [
              {
                label: 'P1',
                value: 'P1'
              },
              {
                label: 'P2',
                value: 'P2'
              }
            ],
            default: 'P1'
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
      index: 3,
      title: 'Boundary conditions',
      dirichlet: {
        label: 'Dirichlet',
        children: [
          {
            label: 'u',
            htmlEntity: 'formula',
            default: '0'
          }
        ]
      },
      neumann: {
        label: 'Neumann',
        children: [
          {
            label: 'du/dn',
            htmlEntity: 'formula',
            default: '0'
          }
        ]
      }
    },
    run: {
      index: 4,
      title: 'Run',
      results: [
        [
          {
            name: 'u',
            data: 'u'
          }
        ]
      ]
    }
  }
}

export default Poisson
