/** @module Models.Description.Stokes */

import ReactDOMServer from 'react-dom/server'

import MathJax from '@/components/assets/mathjax'

// Description
const description = (
  <>
    <h3>Stokes</h3>
    <div>
      Let <MathJax.BackInline text={'\\Omega'} /> be a domain of{' '}
      <MathJax.BackInline text={'\\mathbb{R}^{d}'} />, with{' '}
      <MathJax.BackInline text={'d\\in\\{2,3\\}'} />.
    </div>

    <div>
      The domain <MathJax.BackInline text={'\\Omega'} /> is bounded by{' '}
      <MathJax.BackInline text={'\\Gamma = \\Gamma_D \\cup \\Gamma_N'} />.
    </div>

    <div>
      <MathJax.BackInline text={'u'} /> is the velocity and{' '}
      <MathJax.BackInline text={'p'} /> the pressure.
    </div>

    <div>
      The Stokes equations reads as follow:
      <MathJax.BackFormula
        text={`
\\begin{align}
  \\mu\\Delta u - \\nabla p &= f&\\text{on }\\Omega\\\\
  u &= u_D&\\text{on }\\Gamma_D\\\\
  \\mu\\frac{\\partial u}{\\partial n} - pn &= g_N&\\text{on }\\Gamma_N
\\end{align}
`}
      />
      With <MathJax.BackInline text={'\\mu'} /> the viscosity.
    </div>

    <figure>
      <img src="/images/Stokes.png" alt="Stokes" />
      <figcaption>Stokes equation example on a pipe.</figcaption>
    </figure>

    <div>
      See{' '}
      <a
        target="_blank"
        href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations"
      >
        Wikipedia
      </a>
      {/**/}.
    </div>
  </>
)

export default ReactDOMServer.renderToString(description)
