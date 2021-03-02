/**
 * Navier-Stokes Time-dependant
 * @memberof module:models
 */
const NavierStokesTime = {
  category: 'Fluid',
  name: 'Navier-Stokes time-dependant',
  algorithm: 'navierStokesTime',
  code: 'FreeFEM',
  description: `
  <p>
    Navier-Stokes
  </p>
  <p>
    <a target="_blank" href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations">Wikipedia</a>
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
          label: 'Density',
          name: 'Rho',
          htmlEntity: 'formula',
          default: 1e3,
          unit: '\\(kg.m^{-3}\\)'
        },
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
            label: 'External force (z)',
            htmlEntity: 'formula',
            default: 0,
            unit: '\\(N.m^{-3}\\)'
          }
        ]
      },
      time: {
        label: 'Time',
        children: [
          {
            label: 'Total time',
            htmlEntity: 'formula',
            default: 1,
            unit: 's'
          },
          {
            label: 'Time step',
            htmlEntity: 'formula',
            default: 1e-3,
            unit: 's'
          }
        ]
      },
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        children: [
          {
            label: '[Ux, Uy, Uz, p]',
            htmlEntity: 'select',
            options: [
              {
                label: 'P2/P1',
                value: 'P2, P2, P2, P1'
              },
              {
                label: 'P1b/P1',
                value: 'P1b, P1b, P1b, P1'
              }
            ],
            default: 'P2, P2, P2, P1'
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
      index: 5,
      title: 'Run',
      results: [
        {
          name: 'Velocity'
        },
        {
          name: 'Presure'
        }
      ],
      resultsFilters: [
        {
          name: 'Time',
          pattern: 'Result_^\\d+$.vtu',
          multiplicator: 'parameters, time, children, 1'
        }
      ]
    }
  }
}

export default NavierStokesTime
