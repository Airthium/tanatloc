/** @module Models.Description.ThermicDiffusion */

import ReactDOMServer from 'react-dom/server'

import MathJax from '@/components/assets/mathjax'

// Description
const description = (
  <>
    <h3>Thermal diffusion</h3>
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
      <MathJax.BackInline text={'T'} /> is the temperature.
      <br />
    </div>

    <div>
      The heat equation reads as follow:
      <MathJax.BackFormula
        text={`
    \\begin{align}
      \\rho C_p \\frac{\\partial T}{\\partial t} - \\lambda\\Delta T &= f&\\text{on }\\Omega\\\\
      T &= T_D&\\text{on }\\Gamma_D\\\\
      \\lambda\\frac{\\partial T}{\\partial n} &= g_N&\\text{on }\\Gamma_N
    \\end{align}
    `}
      />
      With <MathJax.BackInline text={'\\rho'} /> the density,{' '}
      <MathJax.BackInline text={'C_p'} /> the heat capacity and{' '}
      <MathJax.BackInline text={'\\lambda'} /> the thermal conductivity.
    </div>

    <figure>
      <img src="/images/Heat.png" alt="Heat" />
      <figcaption>Heat equation example on a beam.</figcaption>
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
