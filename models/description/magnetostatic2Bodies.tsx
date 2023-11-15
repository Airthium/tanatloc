/** @module Models.Description.Magnetostatic2Bodies */

import ReactDOMServer from 'react-dom/server'
import MathJax from '@/components/assets/mathjax'

// Description
const description = (
  <>
    <h3>Magnetostatic for non-conforming meshes</h3>

    <div>
      We consider <MathJax.BackInline text={'\\Omega^{1}'} /> and{' '}
      <MathJax.BackInline text={'\\Omega^{2}'} /> two domains of{' '}
      <MathJax.BackInline text={'\\mathbb{R}^{2}'} />. We suppose that{' '}
      <MathJax.BackInline text={'\\Omega^{1}'} /> and{' '}
      <MathJax.BackInline text={'\\Omega^{2}'} /> have a common interface called{' '}
      <MathJax.BackInline text={'\\Gamma_{c}'} />.
    </div>

    <div>
      The domain <MathJax.BackInline text={'\\Omega^{i}'} />, with{' '}
      <MathJax.BackInline text={'i= 1,2'} />, is bounded by{' '}
      <MathJax.BackInline
        text={
          '\\partial \\Omega^{i} = \\Gamma_d^{i} \\cup\\Gamma_n^{i} \\cup \\Gamma_{c}'
        }
      />
      .
    </div>

    <div>
      Let <MathJax.BackInline text={'A^{i}'} /> be the magnetic vector potential
      in <MathJax.BackInline text={'\\Omega^{i}'} />, verifying{' '}
      <MathJax.BackInline text={'B^{i} = \\nabla \\times A^{i}'} />, where{' '}
      <MathJax.BackInline text={'B^{i}'} /> is the magnetic flux density in{' '}
      <MathJax.BackInline text={'\\Omega^{i}'} />.
    </div>

    <div>
      The magnetostatic equations read as follows
      <MathJax.BackFormula
        text={`
\\begin{align}
  \\nabla \\times ( \\frac{1}{\\mu_{i}} \\nabla \\times A^{i}) &= j^{i} &\\text{in }\\Omega^{i}\\\\
  (\\nabla \\times A^{i}) \\times n^{i} &= 0 &\\text{on }\\Gamma_n^{i}\\\\
  A^{i} \\times n^{i} &= A_D^{i} &\\text{on }\\Gamma_d^{i}\\\\
\\nabla \\cdot A^{i} &= 0 &\\text{in }\\Omega^{i}
\\end{align}
`}
      />
      where <MathJax.BackInline text={'\\mu_{i}'} /> is the magnetic
      permeability of <MathJax.BackInline text={'\\Omega^{i}'} />,{' '}
      <MathJax.BackInline text={'j^{i}'} /> the current density,{' '}
      <MathJax.BackInline text={'n^{i}'} /> the outward unit normal vector on
      the boundary <MathJax.BackInline text={'\\partial \\Omega^{i}'} />, and{' '}
      <MathJax.BackInline text={'\\nabla \\cdot A^{i} = 0'} /> the Coulomb
      gauge.
    </div>

    <div>
      In addition, we have the interface conditions governing the contact area{' '}
      <MathJax.BackInline text={'\\Gamma_{c}'} />, which are expressed as
      follows
      <MathJax.BackFormula
        text={`
\\begin{align}
  A^{1} \\times n^{1} &= -A^{2} \\times n^{2} &\\text{on }\\Gamma_c\\\\
  \\frac{1}{\\mu_{1}}(\\nabla \\times A^{1}) \\times n^{1} &= - \\frac{1}{\\mu_{2}}(\\nabla \\times A^{2}) \\times n^{2} &\\text{on }\\Gamma_c 
\\end{align}
`}
      />
    </div>

    <div>
      The magnetic field intensity <MathJax.BackInline text={'H^{i}'} /> is
      given by
      <MathJax.BackFormula
        text={`
          H^{i} = \\frac{1}{\\mu_{i}} B^{i}
        `}
      />
    </div>
    <div>
      Finally, the "Bi-pass Formulation for Non-conforming Meshes in
      Magnetostatic Problems" is used to solve the magnetostatic problem, where
      the penalty method is employed to take care of the interface conditions.
      For more details about the used formulation or to check how this
      magnetostatic problem is solved, the user is invited to see Houssein's{' '}
      <a
        target="_blank"
        href="https://www.techrxiv.org/articles/preprint/Bi-pass_Formulation_for_Non-conforming_Meshes_in_Magnetostatic_Problems/24315232"
      >
        paper
      </a>
      .
    </div>

    <div>
      {' '}
      <strong>Remark :</strong>{' '}
      <em> 3D magnetostatic problems are not considered.</em>
    </div>
  </>
)

export default ReactDOMServer.renderToString(description)
