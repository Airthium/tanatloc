/** @module Models.Description.LinearElasticityModal */

import ReactDOMServer from 'react-dom/server'

import MathJax from '@/components/assets/mathjax'

// Description
const description = (
  <>
    <h3>Modal analysis</h3>

    <div>
      The modal analysis consists in finding the eigenfrequencies and
      eigenvectors of a structure.
    </div>

    <div>
      Let <MathJax.BackInline text={'K'} /> be the rigidity matrix of the
      structure and <MathJax.BackInline text={'M'} /> its mass matrix.
    </div>

    <div>
      The eigenvalue problem reads as follows
      <MathJax.BackFormula text={'(K -\\lambda M) x =0'} />
      where <MathJax.BackInline text={'\\lambda'} /> is the eigenvalue related
      to the natural frequency <MathJax.BackInline text={'f'} />
      by the following
      <MathJax.BackFormula text={'\\lambda=(2\\pi f)^{2}'} /> and{' '}
      <MathJax.BackInline text={'x'} /> the eigenvector for the mode of the
      frequency <MathJax.BackInline text={'f'} />.
    </div>

    <div>
      Moreover the eigenvalue problem can be transformed as follows
      <MathJax.BackFormula text={'(A -\\sigma M)^{-1}Mx = \\nu x'} />
      where
      <MathJax.BackFormula text={'\\nu  = \\frac{1}{\\lambda-\\sigma}'} />
      and <MathJax.BackInline text={'\\sigma'} /> the shift of the method which
      helps to find eigenvalues near <MathJax.BackInline text={'\\sigma'} />. By
      default <MathJax.BackInline text={'\\sigma=0'} />.
    </div>

    <div>
      You can see{' '}
      <a target="_blank" href="https://freefem.org">
        FreeFEM
      </a>
      .
    </div>
  </>
)

export default ReactDOMServer.renderToString(description)
