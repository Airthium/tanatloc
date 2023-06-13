/** @module Components.Blog.Posts.7ContactMechanics */

import { Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'
import Carousel from '@/components/assets/carousel'

import PostLayout, { Ref } from '../layout'

const key = '1-ContactMechanics'
const title = 'Contact mechanics problems'
const description = 'Validation tests, linear elasticity'
const date = '2023-05-16'
const image = '/images/contactProblem.png'
const keywords = ['Mechanics', 'Validation', 'Theory']
const author = {
  name: 'Houssam Houssein',
  url: 'https://github.com/houssamh'
}

const references = [
  {
    code: '1',
    author: 'Houssam Houssein',
    date: '2023',
    label:
      'Regularized frictional contact problems with the interior point method. Japan Journal of Industrial and Applied Mathematics - Springer.',
    url: 'https://doi.org/10.1007/s13160-023-00565-y'
  },
  {
    code: '2',
    author: 'Houssam Houssein',
    date: '2022',
    label:
      'A Symmetric Algorithm for Solving Mechanical Contact Problems Using FreeFEM. In: Knoerzer, D., Periaux, J., Tuovinen, T. (eds) Advances in Computational Methods and Technologies in Aeronautics and Industry. Computational Methods in Applied Sciences, vol 57. Springer, Cham.',
    url: 'https://doi.org/10.1007/978-3-031-12019-0_17'
  },
  {
    code: '3',
    author: 'Houssam Houssein',
    date: '2022',
    label:
      'Finite element modeling of mechanical contact problems for industrial applications. Doctoral dissertation, Sorbonne université.',
    url: 'https://theses.hal.science/tel-03699706'
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
          Let <MathJax.Inline text={'\\Omega^{i}'} /> , with{' '}
          <MathJax.Inline text={'i\\in\\{1,2\\}'} />, be a domain of{' '}
          <MathJax.Inline text={'\\mathbb{R}^{d}'} /> representing the body{' '}
          <MathJax.Inline text={'i'} /> with{' '}
          <MathJax.Inline text={'d \\in \\{2,3\\}'} />. The domain{' '}
          <MathJax.Inline text={'\\Omega^{i}'} /> is bounded by{' '}
          <MathJax.Inline
            text={
              '\\Gamma^{i} = \\Gamma^{i}_D \\cup \\Gamma^{i}_N \\cup \\Gamma^{i}_C '
            }
          />
          , where <MathJax.Inline text={'\\Gamma^{i}_D'} /> is where a
          displacement is imposed, <MathJax.Inline text={'\\Gamma^{i}_N'} /> is
          where a load is applied and <MathJax.Inline text={'\\Gamma^{i}_C'} />{' '}
          is the potential contact area. Let <MathJax.Inline text={'u^{i}'} />{' '}
          be the displacement field of <MathJax.Inline text={'\\Omega^{i}'} />,
          the contact problem between the two bodies{' '}
          <MathJax.Inline text={'\\Omega^{1}'} /> and{' '}
          <MathJax.Inline text={'\\Omega^{2}'} /> is the set of the linear
          elasticity equations
          <MathJax.Formula
            text={`         
            \\begin{align}
              -\\text{div}(\\sigma^{i}) &= f^{i} &\\text{on }\\Omega^{i}\\\\
              u^{i} &= u^{i}_D&\\text{on }\\Gamma^{i}_D\\\\
              \\sigma^{i}\\cdot n &= \\sigma^{i}_N&\\text{on }\\Gamma^{i}_N
            \\end{align}
          `}
          />
          and the contact conditions. One of these conditions is the
          non-penetration conditions between the two bodies, otherwise speaking
          if <MathJax.Inline text={'x= X^{i}+u^{i} '} /> is the actual position
          on <MathJax.Inline text={'\\Gamma^{i}_C '} /> then
          <MathJax.Formula
            text={`         
            (x-\\bar{x}).n \\geq 0 \\text{ on }\\Gamma^{i}_C
          `}
          />
          where <MathJax.Inline text={'X^{i}'} /> is the initial position,{' '}
          <MathJax.Inline text={'\\bar{x}'} /> the projection of{' '}
          <MathJax.Inline text={'x'} /> on the second body,{' '}
          <MathJax.Inline text={'n'} /> the normal at{' '}
          <MathJax.Inline text={'\\bar{x} '} /> and{' '}
          <MathJax.Inline
            text={
              '\\sigma^{i}_{kj}(u) = \\lambda\\delta_{kj}\\nabla\\cdot u^{i} + 2\\mu\\epsilon_{kj}(u^{i})'
            }
          />
          . <MathJax.Inline text={'\\lambda'} /> and{' '}
          <MathJax.Inline text={'\\mu'} /> are the Lamé coefficients.
        </p>

        <p>
          At the discretization stage, the contact problem is formulated as the
          following minimization problem
          <MathJax.Formula
            text={`         
            \\begin{cases}
              \\text{min} \\, E_{1}(u^{1})+E_{2}(u^{2}) \\text{  s.t }\\\\
              \\int_{\\Gamma^{1}_C}\\phi_{k}.(x-\\bar{x}).n \\, ds \\geq 0  \\text{  } \\forall k=1,...,n_{C1}\\\\
              \\int_{\\Gamma^{2}_C}\\phi_{k}.(x-\\bar{x}).n \\, ds \\geq 0  \\text{  } \\forall k=1,...,n_{C2}
            \\end{cases}
          `}
          />
          where{' '}
          <MathJax.Inline
            text={
              'E_{i}(u^{i}) = \\int_{\\Omega^{i}} \\sigma^{i}:\\epsilon^{i} \\, dx'
            }
          />{' '}
          is the body <MathJax.Inline text={'i'} /> potential energy.{' '}
          <MathJax.Inline text={'n_{Ci}'} /> is the number of nodes in{' '}
          <MathJax.Inline text={'\\Gamma^{i}_C'} /> and{' '}
          <MathJax.Inline text={'\\phi_{k}'} /> is the shape function at the
          mesh node <MathJax.Inline text={'k'} />.
        </p>

        <p>
          Details on the formulation of the contact problem and the method used
          to solve it, can be found in <Ref code="2" /> and in <Ref code="3" />.
          For the frictional case one can see <Ref code="1" />.
        </p>
      </section>

      <section>
        <Typography.Title level={3}>
          Validation test: Compression of two elastic blocks with imposed
          displacement
        </Typography.Title>

        <Typography.Title level={4}>Problem</Typography.Title>
        <p>
          A first elastic rectangular block is posed on a second one (see
          Figures below). The two blocks have the same properties, a width{' '}
          <MathJax.Inline text={'L = 0.5 \\, mm'} />, a height{' '}
          <MathJax.Inline text={'H = 1 \\, mm'} />, a Young&apos;s modulus{' '}
          <MathJax.Inline text={'E = 210 \\, mPa'} /> , and a Poisson&apos;s
          ratio <MathJax.Inline text={' \\nu = 0.'} /> The study is done under
          the plan strain hypothesis (2D).
        </p>
        <p>
          The frictionless case is supposed, and a surface load{' '}
          <MathJax.Inline text={'f = -10 \\, mPa'} /> is applied on the upper
          face of the first block. The lower face of the second body is fixed in
          the direction <MathJax.Inline text={'y'} /> and the left sides of the
          two blocks are fixed in the direction <MathJax.Inline text={'x'} />.
        </p>
        <p>
          Theoretically all components of the stress tensor are zero except{' '}
          <MathJax.Inline text={'\\sigma_{yy}'} /> which is equal to{' '}
          <MathJax.Inline text={'\\sigma_{zz}=-10 \\, mPa'} />, so the von Mises
          stress is constant and is equal to{' '}
          <MathJax.Inline text={'\\sigma_{vM}=10 \\, mPa'} />.
        </p>
      </section>

      <section>
        <Typography.Title level={4}>Simulation and Results</Typography.Title>
        <p>
          Using Tanatloc, we create our geometry with the corresponding mesh
          (see Figures below) and we use P1 linear finite elements. We can see
          in the Figures below that we obtain the theoretical results.
        </p>
        <Carousel
          items={[
            {
              key: 'stressyy',
              src: '/blog/7-contactMechanics/validation1_stressyy.png',
              caption: 'Stress yy'
            },
            {
              key: 'linearElastvM',
              src: '/blog/7-contactMechanics/validation1_vMStress.png',
              caption: 'von Mises stress'
            }
          ]}
        />
      </section>

      <section>
        <Typography.Title level={4}>Remark</Typography.Title>
        <p>
          For a better results, please use the units{' '}
          <MathJax.Inline text={'mm'} /> and <MathJax.Inline text={'mPa'} />.
        </p>
      </section>

      <section>
        <Typography.Title level={3}>
          Validation test: Hertz contact problem
        </Typography.Title>

        <Typography.Title level={4}>Problem</Typography.Title>
        <p>
          This example consider the contact between an elastic cylinder (
          <MathJax.Inline text={'E_1 = 210 \\, mPa'} />,{' '}
          <MathJax.Inline text={'\\nu_{1}=0.3'} />) and an elastic block (
          <MathJax.Inline text={'E_2 = 70 \\, mPa'} />,{' '}
          <MathJax.Inline text={'\\nu_{2}=0.3'} />
          ), the cylinder is posed on the block and a force of{' '}
          <MathJax.Inline text={'P = 7 \\, N/mm'} /> is applied on the top of
          the cylinder, the block is fixed in the direction{' '}
          <MathJax.Inline text={'y'} /> at its base. The study is done under the
          plane strain hypothesis, therefore the cylinder is modeled by a disc
          of radius <MathJax.Inline text={'R1 = 50 \\, mm'} /> and the block by
          a square of dimension <MathJax.Inline text={'L = 100 \\, mm'} />.
        </p>
        <p>
          Due to the symmetry of the problem only the half of the problem is
          modeled, note that the frictionless contact is supposed for this
          problem.
        </p>
        <p>
          Theoretically the maximum pressure at the contact zone is equal to{' '}
          <MathJax.Inline text={'p_{max} = 1.6 \\, mPa'} />.
        </p>
      </section>

      <section>
        <Typography.Title level={4}>Simulation and Results</Typography.Title>
        <p>
          Using Tanatloc, we create our geometry with the corresponding mesh
          (see Figures below) and we use P1 linear finite elements. We can see
          in the Figures below that we obtain the theoretical results,
          especially in the Figure where <MathJax.Inline text={'\\sigma_y'} />{' '}
          is presented.
        </p>
        <Carousel
          items={[
            {
              key: 'meshHertz',
              src: '/blog/7-contactMechanics/validation2_mesh.png',
              caption: 'Mesh quality'
            },
            {
              key: 'stressyHertz',
              src: '/blog/7-contactMechanics/validation2_stressyy.png',
              caption: 'Stress yy'
            },
            {
              key: 'linearElastvMHertz',
              src: '/blog/7-contactMechanics/validation2_vMStress.png',
              caption: 'von Mises stress'
            }
          ]}
        />
      </section>
    </PostLayout>
  )
}

const ContactMechanics = {
  default: Post,
  key,
  title,
  description,
  date,
  image,
  keywords,
  author
}

export default ContactMechanics
