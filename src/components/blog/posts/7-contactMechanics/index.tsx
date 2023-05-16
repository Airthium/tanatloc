/** @module Components.Blog.Posts.7ContactMechanics */

import { Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'
import Carousel from '@/components/assets/carousel'

import PostLayout from '../layout'

const key = '1-ContactMechanics'
const title = 'Contact mechanics problems'
const description = 'Validation tests, linear elasticity'
const date = '2023-05-16'
const image = '/images/LinearElasticity.jpg'
const keywords = ['Mechanics', 'Validation', 'Theory']
const author = {
  name: 'Houssam Houssein',
  url: 'https://github.com/houssamh'
}

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
    >
      <section>
        <Typography.Title level={3}>Theory</Typography.Title>
        <p>
          Let <MathJax.Inline text={'\\Omega'} /> be a domain of{' '}
          <MathJax.Inline text={'\\mathbb{R}^{d}'} /> representing the body,
          with <MathJax.Inline text={'d\\in\\{2,3\\}'} />. The domain{' '}
          <MathJax.Inline text={'\\Omega'} /> is bounded by{' '}
          <MathJax.Inline text={'\\Gamma = \\Gamma_D \\cup \\Gamma_N'} />.
        </p>
        <p>
          Let <MathJax.Inline text={'u'} /> be the displacement field. The
          linear elasticity problem is the set of the following equations
          <MathJax.Formula
            text={`         
            \\begin{align}
                -\\text{div}(\\sigma) &= f &\\text{on }\\Omega\\\\
                u &= u_D&\\text{on }\\Gamma_D\\\\
                \\sigma\\cdot n &= \\sigma_N&\\text{on }\\Gamma_N
            \\end{align}
          `}
          />
          in addition to the Hook&apos;s law{' '}
          <MathJax.Inline
            text={'\\sigma= \\lambda tr(\\epsilon)I + 2\\mu\\epsilon'}
          />
          , where <MathJax.Inline text={'\\sigma'} />,{' '}
          <MathJax.Inline text={'\\epsilon'} /> are respectively the stress and
          strain tensor. <MathJax.Inline text={'\\lambda'} /> and{' '}
          <MathJax.Inline text={'\\mu'} /> are the Lamé coefficients. For more
          details, see Reddy, J. N. (2013)
        </p>
      </section>

      <section>
        <Typography.Title level={3}>
          Validation test: Compression of an elastic cube
        </Typography.Title>

        <Typography.Title level={4}>Problem</Typography.Title>
        <p>
          Consider an elastic cube{' '}
          <MathJax.Inline
            text={
              '[0 \\, m \\, , 1 \\, m]\\times[0 \\, m \\, , 1 \\, m]\\times[0 \\, m \\, , 1 \\, m]'
            }
          />{' '}
          with Young&apos;s modulus <MathJax.Inline text={'E=2.1e11 \\, Pa'} />{' '}
          and Poisson&apos;s ratio <MathJax.Inline text={'\\nu= 0.3'} />. The
          plan <MathJax.Inline text={'\\{ z=0 \\}'} /> of the cube is fixed in
          the direction <MathJax.Inline text={'z'} />, the plan{' '}
          <MathJax.Inline text={'\\{ x=1 \\}'} /> of the cube is fixed in the
          direction <MathJax.Inline text={'x'} /> and finally the plan{' '}
          <MathJax.Inline text={'\\{ y=0 \\}'} /> of the cube is fixed in the
          direction <MathJax.Inline text={'y'} />.
        </p>
        <p>
          A surface load{' '}
          <MathJax.Inline
            text={'f=(0 \\, Pa \\, ,0 \\, Pa \\, ,-1e8 \\, Pa)'}
          />{' '}
          is applied on the plan <MathJax.Inline text={'\\{ z=1 \\}'} /> of the
          cube.
        </p>
        <p>
          Theoretically all components of the stress tensor are zero except{' '}
          <MathJax.Inline text={'\\sigma_{zz}'} /> which is equal to{' '}
          <MathJax.Inline text={'\\sigma_{zz}=-1e8 \\, Pa'} />, so the von Mises
          stress is constant and is equal to{' '}
          <MathJax.Inline text={'\\sigma_{vM}=1e8 \\, Pa'} />.
        </p>
      </section>

      <section>
        <Typography.Title level={4}>Simulation and Results</Typography.Title>
        <p>
          Using Tanatloc, we create our geometry with the corresponding mesh
          (see Figures below) and we use P1 linear finite elements. We can also
          see in the Figures below that we obtain the theoretical results,
          independently of the used mesh.
        </p>
        <Carousel
          items={[
            {
              key: 'MeshGeometry',
              src: '/blog/3-linearElasticity/GeoMesh.jpg',
              caption: 'Geometry and Mesh'
            },
            {
              key: 'linearElastDisp',
              src: '/blog/3-linearElasticity/validation1_displacementResults.jpg',
              caption: 'Displacement result'
            },
            {
              key: 'stressZz',
              src: '/blog/3-linearElasticity/validation1_stressZz.jpg',
              caption: 'Stress zz'
            },
            {
              key: 'linearElastvM',
              src: '/blog/3-linearElasticity/validation1_vMStress.jpg',
              caption: 'von Mises stress'
            }
          ]}
        />
      </section>

      <section>
        <Typography.Title level={4}>References</Typography.Title>
        <p>
          Reddy, J. N. (2013). An introduction to continuum mechanics. Cambridge
          university press.
        </p>
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
