/** @module Models.Stokes */

import { IModel } from './index.d'

/**
 * Stokes
 */
const Stokes: IModel = {
  category: 'Fluid',
  name: 'Stokes time-dependant',
  algorithm: 'stokesTime',
  code: 'FreeFEM',
  version: '1.0.0',
  description: 'TODO',
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
    },
    {
      label: 'Pressure',
      value: 'p'
    },
    {
      label: 'Time',
      value: 't'
    },
    {
      label: 'Total time',
      value: 'T'
    },
    {
      label: 'Time step',
      value: 'dt'
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
          default: '1e3',
          units: [
            { label: 'kg.m^{-3}' },
            { label: 'g.mm^{-3}', multiplicator: 1e6 }
          ],
          unit: { label: 'kg.m^{-3}' }
        },
        {
          label: 'Dynamic viscosity',
          name: 'Mu',
          htmlEntity: 'formula',
          default: '1e-3',
          units: [{ label: 'Pa.s' }, { label: 'mPa.s', multiplicator: 1e3 }],
          unit: { label: 'Pa.s' }
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
      time: {
        label: 'Time',
        children: [
          {
            label: 'Total time',
            htmlEntity: 'formula',
            default: '1',
            units: [{ label: 's' }],
            unit: { label: 's' }
          },
          {
            label: 'Time step',
            htmlEntity: 'formula',
            default: '0.1',
            units: [{ label: 's' }],
            unit: { label: 's' }
          }
        ]
      },
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        children: [
          {
            label: '[Ux, Uy, Uz, p]',
            label2D: '[Ux, Uy, p]',
            htmlEntity: 'select',
            options: [
              {
                label: 'P2/P1',
                value: 'P2, P2, P2, P1',
                value2D: 'P2, P2, P1'
              },
              {
                label: 'P1b/P1',
                value: 'P1b, P1b, P1b, P1',
                value2D: 'P1b, P1b, P1'
              }
            ],
            default: 'P2, P2, P2, P1',
            default2D: 'P2, P2, P1'
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
      symmetric: {
        advanced: true,
        label: 'Symmetric formulation',
        children: [
          {
            label: 'Enabled',
            htmlEntity: 'checkbox',
            default: false
          }
        ]
      }
    },
    initialization: {
      index: 4,
      title: 'Initialization',
      done: true,
      direct: {
        label: 'Velocity',
        children: [
          {
            label: 'Ux',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'm.s^{-1}' },
              { label: 'mm.s^{-1}', multiplicator: 1e3 }
            ],
            unit: { label: 'm.s^{-1}' }
          },
          {
            label: 'Uy',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'm.s^{-1}' },
              { label: 'mm.s^{-1}', multiplicator: 1e3 }
            ],
            unit: { label: 'm.s^{-1}' }
          },
          {
            only3D: true,
            label: 'Uz',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'm.s^{-1}' },
              { label: 'mm.s^{-1}', multiplicator: 1e3 }
            ],
            unit: { label: 'm.s^{-1}' }
          }
        ]
      },
      coupling: {
        label: 'Coupling',
        compatibility: [
          {
            algorithm: 'navierStokesTime',
            filter: {
              name: 'Time step',
              prefixPattern: 'Result_',
              suffixPattern: '.vtu',
              pattern: 'Result_\\d+.vtu',
              multiplicator: ['parameters', 'time', 'children', '1']
            }
          }
        ]
      }
    },
    boundaryConditions: {
      index: 5,
      title: 'Boundary conditions',
      wall: {
        label: 'Wall'
      },
      freeOutlet: {
        label: 'Free outlet'
      },
      dirichlet: {
        label: 'Velocity',
        children: [
          {
            label: 'Ux',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'm.s^{-1}' },
              { label: 'mm.s^{-1}', multiplicator: 1e3 }
            ],
            unit: { label: 'm.s^{-1}' }
          },
          {
            label: 'Uy',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'm.s^{-1}' },
              { label: 'mm.s^{-1}', multiplicator: 1e3 }
            ],
            unit: { label: 'm.s^{-1}' }
          },
          {
            only3D: true,
            label: 'Uz',
            htmlEntity: 'formula',
            default: '0',
            units: [
              { label: 'm.s^{-1}' },
              { label: 'mm.s^{-1}', multiplicator: 1e3 }
            ],
            unit: { label: 'm.s^{-1}' }
          }
        ],
        refineFactor: 2
      },
      neumann: {
        label: 'Pressure',
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
      }
    },
    run: {
      index: 6,
      title: 'Run',
      results: [
        [
          {
            name: 'Velocity',
            data: ['Ux', 'Uy', 'Uz'],
            data2D: ['Ux', 'Uy', '0'],
            units: [
              { label: 'm.s^-1' },
              { label: 'mm.s^{-1}', multiplicator: 1e3 }
            ],
            unit: { label: 'm.s^-1' }
          },
          {
            name: 'Pressure',
            data: 'p',
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
      resultsFilter: {
        name: 'Time',
        prefixPattern: 'Result_',
        suffixPattern: '.vtu',
        pattern: 'Result_\\d+.vtu',
        multiplicator: ['parameters', 'time', 'children', '1']
      },
      postprocessing: [
        {
          key: 'streamTracer',
          parameters: [
            {
              key: 'Vectors',
              value: 'Velocity'
            }
          ]
        }
      ]
    }
  }
}

export default Stokes
