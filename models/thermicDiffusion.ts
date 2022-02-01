import { IModel } from './index.d'

/**
 * Thermic diffusion
 * @memberof Models
 */
const ThermicDiffusion: IModel = {
  category: 'Thermic',
  name: 'Thermal diffusion',
  algorithm: 'thermicDiffusion',
  code: 'FreeFEM',
  version: '1.0.0',
  description: `
  <h3>
    Thermal diffusion
  </h3>
  <p>
    Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>

    The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>

      \\(T\\) is the temperature.<br/>

    The heat equation reads as follow:

    $$
    \\begin{align}
      \\rho C_p \\frac{\\partial T}{\\partial t} - \\lambda\\Delta T &= f&\\text{on }\\Omega\\\\
      T &= T_D&\\text{on }\\Gamma_D\\\\
      \\lambda\\frac{\\partial T}{\\partial n} &= g_N&\\text{on }\\Gamma_N
    \\end{align}
    $$

    With \\(\\rho\\) the density, \\(C_p\\) the heat capacity and \\(\\lambda\\) the thermal conductivity.
  </p>

  <figure>
    <img src="/images/Heat.png" alt="Heat" />
    <figcaption>Heat equation example on a beam.</figcaption>
  </figure>
  </p>

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
          label: 'Density',
          name: 'Rho',
          htmlEntity: 'formula',
          default: 7960,
          unit: '\\(kg.m^{-3}\\)'
        },
        {
          label: 'Thermal conductivity',
          name: 'Lambda',
          htmlEntity: 'formula',
          default: 15,
          unit: '\\(W.m^{-1}.K^{-1}\\)'
        },
        {
          label: 'Heat capacity',
          name: 'Cp',
          htmlEntity: 'formula',
          default: 502,
          unit: '\\(J.K^{-1}.kg^{-1}\\)'
        }
      ]
    },
    parameters: {
      index: 3,
      title: 'Parameters',
      time: {
        label: 'Time',
        children: [
          {
            label: 'Total time',
            htmlEntity: 'formula',
            default: 1,
            unit: '\\(s\\)'
          },
          {
            label: 'Time step',
            htmlEntity: 'formula',
            default: 0.1,
            unit: '\\(s\\)'
          }
        ]
      },
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        children: [
          {
            label: 'T',
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
      index: 4,
      title: 'Boundary conditions',
      temperature: {
        label: 'Temperature',
        children: [
          {
            label: 'T',
            htmlEntity: 'formula',
            default: 0,
            unit: 'K'
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
          name: 'T'
        }
      ],
      resultsFilters: [
        {
          name: 'Time',
          prefixPattern: 'Result_',
          suffixPattern: '.vtu',
          pattern: 'Result_\\d+.vtu',
          multiplicator: ['parameters', 'time', 'children', '1']
        }
      ]
    }
  }
}

export default ThermicDiffusion
