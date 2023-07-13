/** @module Models.Description.Magnetostatic */

import ReactDOMServer from 'react-dom/server'
import MathJax from '@/components/assets/mathjax'

// Description
const description = (
  <>
    <h3>Magnetostatic</h3>

    <div>
      Let <MathJax.BackInline text={'\\Omega'} /> be a domain of{' '}
      <MathJax.BackInline text={'\\mathbb{R}^{d}'} />, with{' '}
      <MathJax.BackInline text={'d\\in\\{2,3\\}'} />.
    </div>

    <div>
      The domain <MathJax.BackInline text={'\\Omega'} /> is bounded by{' '}
      <MathJax.BackInline
        text={'\\partial \\Omega = \\Gamma_D \\cup\\Gamma_N'}
      />
      .
    </div>

    <div>
      Let <MathJax.BackInline text={'A'} /> be the magnetic vector potential,
      verifying <MathJax.BackInline text={'B = \\nabla \\times A'} />, where{' '}
      <MathJax.BackInline text={'B'} /> is the magnetic flux density.
    </div>

    <div>
      Therefore, the magnetostatic equation reads as follows
      <MathJax.BackFormula
        text={`
\\begin{align}
  \\nabla \\times ( \\frac{1}{\\mu} \\nabla \\times A) &= j &\\text{in }\\Omega\\\\
  (\\nabla \\times A) \\times n &= 0 &\\text{on }\\Gamma_N\\\\
  A \\times n &= A_D &\\text{on }\\Gamma_D\\\\
\\nabla \\cdot A &= 0 &\\text{in }\\Omega
\\end{align}
`}
      />
      where <MathJax.BackInline text={'\\mu'} /> is the magnetic permeability,
      and <MathJax.BackInline text={'\\nabla \\cdot A = 0'} /> the Coulomb
      gauge.
    </div>

    <div>
      Finally the magnetic field intensity <MathJax.BackInline text={'H'} /> is
      given by
      <MathJax.BackFormula
        text={`
          H = \\frac{1}{\\mu} B
        `}
      />
    </div>
  </>
)

export default ReactDOMServer.renderToString(description)
