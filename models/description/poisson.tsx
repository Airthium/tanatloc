/** @module Models.Description.Poisson */

import ReactDOMServer from 'react-dom/server'

import MathJax from '@/components/assets/mathjax'

// Description
const description = (
  <>
    <h3>Poisson&apos;s equation</h3>

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
      The Poisson&apos;s equation reads as follow:
      <MathJax.BackFormula
        text={`
\\begin{align}
  \\Delta u &= f &\\text{on }\\Omega\\\\
  u &= u_D &\\text{on }\\Gamma_D\\\\
  \\nabla u &= g_N &\\text{on }\\Gamma_N
\\end{align}
`}
      />
    </div>

    <figure>
      <img src="/images/Poisson.png" alt="Poisson" />
      <figcaption>Poisson&apos;s equation example on a cube.</figcaption>
    </figure>

    <div>
      See{' '}
      <a
        target="_blank"
        href="https://en.wikipedia.org/wiki/Poisson%27s_equation"
      >
        Wikipedia
      </a>
      .
    </div>
  </>
)

export default ReactDOMServer.renderToString(description)
