import ReactDOMServer from 'react-dom/server'

import MathJax from '@/components/assets/mathjax'

// Description
const description = (
  <>
    <h3>Linear elasticity</h3>

    <div>
      Let <MathJax.BackInline text={'\\Omega'} /> be a domain of{' '}
      <MathJax.BackInline text={'\\mathbb{R}^{d}'} />, with{' '}
      <MathJax.BackInline text={'d\\in\\{2,3\\}'} />.
    </div>
    <div>
      The domain <MathJax.BackInline text={'\\Omega'} /> is bounded by{' '}
      <MathJax.BackInline text={'\\Gamma = \\Gamma_D \\cup\\Gamma_N'} />.
    </div>
    <div>
      <MathJax.BackInline text={'u'} /> is the displacement.
    </div>
    <div>
      The linear elasticity equation reads as follow:
      <MathJax.BackFormula
        text={
          '\\begin{align}-\\text{div}(\\sigma) &= f &\\text{on}\\Omega\\\\ u &= u_D&\\text{on}\\Gamma_D\\\\ \\sigma\\cdot n &= u_N&\\text{on}\\Gamma_N \\end{align}'
        }
      />
      With{' '}
      <MathJax.BackInline
        text={
          '\\sigma_{ij}(u) = \\lambda\\delta_{ij}\\nabla\\cdot u + 2\\mu\\epsilon_{ij}(u)'
        }
      />
      .
    </div>
    <div>
      <MathJax.BackInline text={'\\lambda'} /> and{' '}
      <MathJax.BackInline text={'\\mu'} /> are the Lamé coefficients.
    </div>
    <figure>
      <img src="/images/LinearElasticity.png" alt="Linear Elasticity" />
      <figcaption>Linear elasticity equation example on a beam.</figcaption>
    </figure>
    <div>
      See{' '}
      <a target="_blank" href="https://en.wikipedia.org/wiki/Linear_elasticity">
        Wikipedia
      </a>
      .
    </div>
  </>
)

export default ReactDOMServer.renderToString(description)
