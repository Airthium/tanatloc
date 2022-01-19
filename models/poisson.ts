import { IModel } from './index.d'

/**
 * Poisson's equation
 * @memberof Models
 */
const Poisson: IModel = {
  category: 'Academic',
  name: "Poisson's equation",
  algorithm: 'poisson',
  code: 'FreeFEM',
  version: '1.0.0',
  description: `
  <h3>
    Poisson's equation
  </h3>
  <p>
  Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>

  The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>

  The Poisson's equation reads as follow:
  \\begin{align}
    \\Delta u &= f &\\text{on }\\Omega\\\\
    u &= u_D &\\text{on }\\Gamma_D\\\\
    \\nabla u &= g_N &\\text{on }\\Gamma_N
  \\end{align}
  </p>
  <figure>
    <img src="/images/Poisson.png" alt="Poisson" />
    <figcaption>Poisson's equation example on a cube.</figcaption>
  </figure>
  <p>
      See <a target="_blank" href="https://en.wikipedia.org/wiki/Poisson%27s_equation">Wikipedia</a>.
  </p>
  `,
  configuration: {
    geometry: {
      index: 1,
      title: 'Geometry',
      meshable: true
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
            default: 0
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
            default: 0
          }
        ]
      },
      neumann: {
        label: 'Neumann',
        children: [
          {
            label: 'du/dn',
            htmlEntity: 'formula',
            default: 0
          }
        ]
      }
    },
    run: {
      index: 4,
      title: 'Run',
      results: [
        {
          name: 'u'
        }
      ]
    }
  }
}

export default Poisson
