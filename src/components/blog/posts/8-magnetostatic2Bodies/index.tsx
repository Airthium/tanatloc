/** @module Components.Blog.Posts.7ContactMechanics */

import { Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'

import PostLayout, { Ref } from '../layout'

const key = '8-Magnetostatic2Bodies'
const title = 'Magnetostatic problems for non-conforming meshes'
const description = 'magnetostatic'
const date = '2024-04-05'
const image = '/images/Magnetostatic2Bodies.png'
const keywords = ['Magnetostatic', 'Theory']
const author = {
  name: 'Houssam Houssein',
  url: 'https://github.com/houssamh'
}

const references = [
  {
    code: '1',
    author: 'Houssam Houssein',
    date: '2024',
    label:
      'Symmetric Formulation for Non-Conforming Meshes in Magnetostatic Problems. IEEE Transactions on Magnetics.',
    url: 'https://ieeexplore.ieee.org/abstract/document/10414152'
  }
]

/**
 * Post
 * @returns Post
 */
const Post = () => {
  return (
    <PostLayout
      title={title}
      date={date}
      image={image}
      keywords={keywords}
      author={author}
      version={'1.2.6'}
      references={references}
    >
      <section>
        <Typography.Title level={3}>Theory</Typography.Title>

        <p>
          We consider <MathJax.Inline text={'\\Omega^{1}'} /> and{' '}
          <MathJax.Inline text={'\\Omega^{2}'} /> two domains of{' '}
          <MathJax.Inline text={'\\mathbb{R}^{2}'} />. We suppose that{' '}
          <MathJax.Inline text={'\\Omega^{1}'} /> and{' '}
          <MathJax.Inline text={'\\Omega^{2}'} /> have a common interface called{' '}
          <MathJax.Inline text={'\\Gamma_{c}'} />.
        </p>

        <p>
          The domain <MathJax.Inline text={'\\Omega^{i}'} />, with{' '}
          <MathJax.Inline text={'i= 1,2'} />, is bounded by{' '}
          <MathJax.Inline
            text={
              '\\partial \\Omega^{i} = \\Gamma_d^{i} \\cup\\Gamma_n^{i} \\cup \\Gamma_{c}'
            }
          />
          .
        </p>

        <p>
          Let <MathJax.Inline text={'A^{i}'} /> be the magnetic vector potential
          in <MathJax.Inline text={'\\Omega^{i}'} />, verifying{' '}
          <MathJax.Inline text={'B^{i} = \\nabla \\times A^{i}'} />, where{' '}
          <MathJax.Inline text={'B^{i}'} /> is the magnetic flux density in{' '}
          <MathJax.Inline text={'\\Omega^{i}'} />.
        </p>

        <p>
          The magnetostatic equations read as follows
          <MathJax.Formula
            text={`
\\begin{align}
  \\nabla \\times ( \\frac{1}{\\mu_{i}} \\nabla \\times A^{i}) &= j^{i} &\\text{in }\\Omega^{i}\\\\
  (\\nabla \\times A^{i}) \\times n^{i} &= 0 &\\text{on }\\Gamma_n^{i}\\\\
  A^{i} \\times n^{i} &= A_D^{i} &\\text{on }\\Gamma_d^{i}\\\\
\\nabla \\cdot A^{i} &= 0 &\\text{in }\\Omega^{i}
\\end{align}
`}
          />
          where <MathJax.Inline text={'\\mu_{i}'} /> is the magnetic
          permeability of <MathJax.Inline text={'\\Omega^{i}'} />,{' '}
          <MathJax.Inline text={'j^{i}'} /> the current density,{' '}
          <MathJax.Inline text={'n^{i}'} /> the outward unit normal vector on
          the boundary <MathJax.Inline text={'\\partial \\Omega^{i}'} />, and{' '}
          <MathJax.Inline text={'\\nabla \\cdot A^{i} = 0'} /> the Coulomb
          gauge.
        </p>

        <p>
          In addition, we have the interface conditions governing the contact
          area <MathJax.Inline text={'\\Gamma_{c}'} />, which are expressed as
          follows
          <MathJax.Formula
            text={`
\\begin{align}
  A^{1} \\times n^{1} &= -A^{2} \\times n^{2} &\\text{on }\\Gamma_c\\\\
  \\frac{1}{\\mu_{1}}(\\nabla \\times A^{1}) \\times n^{1} &= - \\frac{1}{\\mu_{2}}(\\nabla \\times A^{2}) \\times n^{2} &\\text{on }\\Gamma_c 
\\end{align}
`}
          />
        </p>

        <p>
          The magnetic field intensity <MathJax.Inline text={'H^{i}'} /> is
          given by
          <MathJax.Formula
            text={`
          H^{i} = \\frac{1}{\\mu_{i}} B^{i}
        `}
          />
        </p>

        <p>
          Finally, the &apos;Symmetric Formulation for Non-Conforming Meshes in
          Magnetostatic Problems&apos; is used to solve the magnetostatic
          problem, where the penalty method is employed to take care of the
          interface conditions. For more details about the used formulation or
          to check how this magnetostatic problem is solved, the user is invited
          to see <Ref code="1" />.
        </p>

        <p>
          <strong>Remark :</strong>{' '}
          <em> 3D magnetostatic problems are not considered.</em>
        </p>
      </section>
    </PostLayout>
  )
}

const Magnetostatic2Bodies = {
  default: Post,
  key,
  title,
  description,
  date,
  image,
  keywords,
  author
}

export default Magnetostatic2Bodies
