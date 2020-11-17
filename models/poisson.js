/**
 * Poisson equation
 */
const Poisson = {
  category: 'Academic',
  name: "Poisson's equation",
  algorithm: 'Poisson',
  description: `
    <p>
        Poisson's equation:
        \\[
        \\Delta u = f
        \\]
    </p>
    <p>
        <a target="_blank" href="https://en.wikipedia.org/wiki/Poisson%27s_equation">Wikipedia page</a>
    </p>
  `,
  categories: {
    geometry: {
      index: 1,
      title: 'Geometry'
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
            default: 'P1',
            name: 'Uh'
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
            default: 0
          }
        ]
      },
      neumann: {
        label: 'Neumann',
        children: [
          {
            label: 'du/dn',
            default: 0
          }
        ]
      }
    },
    run: {
      index: 4,
      title: 'Run'
    }
  }
}

export default Poisson
