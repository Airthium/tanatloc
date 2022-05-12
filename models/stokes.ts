/** @module Models.Stokes */

import { IModel } from './index.d'

/**
 * Stokes
 */
const Stokes: IModel = {
  category: 'Fluid',
  name: 'Stokes',
  algorithm: 'stokes',
  code: 'FreeFEM',
  version: '1.0.0',
  description: `
  <h3>
    Stokes
  </h3>
  <p>
    Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>

    The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>

    \\(u\\) is the velocity and \\(p\\) the pressure.<br/>

    The Stokes equations reads as follow:

    $$
    \\begin{align}
      \\mu\\Delta u - \\nabla p &= f&\\text{on }\\Omega\\\\
      u &= u_D&\\text{on }\\Gamma_D\\\\
      \\mu\\frac{\\partial u}{\\partial n} - pn &= g_N&\\text{on }\\Gamma_N
    \\end{align}
    $$

    With \\(\\mu\\) the viscosity.
  </p>
  <figure>
    <img src="/images/Stokes.png" alt="Stokes" />
    <figcaption>Stokes equation example on a pipe.</figcaption>
  </figure>
  <p>
    See <a target="_blank" href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations">Wikipedia</a>.
  </p>
  `,
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
          label: 'Dynamic viscosity',
          name: 'Mu',
          htmlEntity: 'formula',
          default: 1e-3,
          unit: '\\(Pa.s^{-1}\\)'
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
            default: 0,
            unit: '\\(N.m^{-3}\\)'
          },
          {
            label: 'External force (y)',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(N.m^{-3}\\)'
          },
          {
            only3D: true,
            label: 'External force (z)',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(N.m^{-3}\\)'
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
            default: 0,
            unit: '\\(m.s^{-1}\\)'
          },
          {
            label: 'Uy',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(m.s^{-1}\\)'
          },
          {
            only3D: true,
            label: 'Uz',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(m.s^{-1}\\)'
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
            default: 0,
            unit: '\\(N.m^{-2}\\)'
          }
        ],
        refineFactor: 2
      }
    },
    run: {
      index: 6,
      title: 'Run',
      results: [
        {
          name: 'Velocity'
        },
        {
          name: 'Presure'
        }
      ],
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
