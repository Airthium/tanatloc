/** @module Components.Blog.Posts.5ThermalExpansion */

import { Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'
import Carousel from '@/components/assets/carousel'

import PostLayout from '../layout'

export const key = '3-ThermalExpansion'
export const title = 'Thermal expansion problems'
export const description = 'Validation tests, thermal expansion'
export const date = '2023-02-24'
export const image = '/images/thermalExpansion.png'
export const keywords = ['Thermal Expansion', 'Validation', 'Theory']
export const author = {
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
          <MathJax.Inline text={'\\mathbb{R}^{d}'} />, with{' '}
          <MathJax.Inline text={'d\\in\\{2,3\\}'} />. The domain{' '}
          <MathJax.Inline text={'\\Omega'} /> is bounded by{' '}
          <MathJax.Inline text={'\\Gamma = \\Gamma_D \\cup \\Gamma_N'} />. Let{' '}
          <MathJax.Inline text={'T'} /> be the temperature, then the heat
          equation reads as follows
          <MathJax.Formula
            text={`         
            \\begin{align}
            - \\nabla.(\\lambda\\nabla T) +c_d &= 0&\\text{on }\\Omega\\\\
            T &= T_D&\\text{on }\\Gamma_D\\\\
            \\lambda\\frac{\\partial T}{\\partial n} &= \\Phi_d&\\text{on }\\Gamma_N
            \\end{align}
          `}
          />
          with <MathJax.Inline text={'c_d'} /> the heat volumetric input,{' '}
          <MathJax.Inline text={'\\lambda'} /> the thermal conductivity,{' '}
          <MathJax.Inline text={'T_{D}'} /> an imposed temperature and{' '}
          <MathJax.Inline text={'\\Phi_d'} /> an imposed heat flux.
        </p>
        <p>
          The study of the thermal expansion of a material is done by a weak
          coupling, otherwise speaking, the thermal problem is solved first in
          order to obtain the temperature field, and the mechanical problem is
          solved after, using the computed temperature, in order to obtain the
          displacement field.
        </p>
        <p>
          If <MathJax.Inline text={'u'} /> denotes the displacement field then
          the linear elasticity equation reads as follows
          <MathJax.Formula
            text={`         
            \\begin{align}
            -\\text{div}(\\sigma) &= f &\\text{on } \\Omega\\\\
            u &= u_D &\\text{on } \\Gamma_D\\\\
            \\sigma\\cdot n &= \\sigma_N&\\text{on }\\Gamma_N 
            \\end{align}
          `}
          />
        </p>
        <p>
          with{' '}
          <MathJax.Inline
            text={
              '\\sigma(u) = 2\\mu\\epsilon^{m}(u) + \\lambda tr(\\epsilon^{m} ) I'
            }
          />
          .
        </p>
        <p>
          <MathJax.Inline text={'\\epsilon^{m}= \\epsilon - \\epsilon^{th}'} />{' '}
          is the mechanical strain tensor.
        </p>
        <p>
          <MathJax.Inline
            text={'\\epsilon= \\frac{1}{2}(\\nabla u + (\\nabla u) ^{T})'}
          />{' '}
          is the total strain tensor.
        </p>
        <p>
          <MathJax.Inline text={'\\epsilon^{th} = \\alpha (T-T_{0}) I'} /> is
          the thermal strain tensor.
        </p>
        <p>
          <MathJax.Inline text={'\\alpha '} /> is the coefficient of the linear
          thermal expansion and <MathJax.Inline text={'T_{0} '} /> the initial
          temperature.
        </p>
        <p>
          <MathJax.Inline text={'\\lambda'} /> and{' '}
          <MathJax.Inline text={'\\mu'} /> are the Lamé coefficients.
        </p>
      </section>
      <section>
        <Typography.Title level={3}>
          Validation test: cube blocked on all its faces
        </Typography.Title>

        <Typography.Title level={4}>Problem</Typography.Title>
        <p>
          In this example we consider an elastic cube{' '}
          <MathJax.Inline
            text={
              '[0 \\, m \\, , 1 \\, m]\\times[0 \\, m \\, , 1 \\, m]\\times[0 \\, m \\, , 1 \\, m]'
            }
          />{' '}
          with Young&apos;s modulus <MathJax.Inline text={'E=2.1e11 \\, Pa'} />{' '}
          and Poisson&apos;s ratio <MathJax.Inline text={'\\nu= 0.3'} />, all
          faces of the cube are fixed. The initial temperature is equal to{' '}
          <MathJax.Inline text={'T_{0}= 293.15\\, K'} />, the coefficient of the
          linear thermal expansion is equal to{' '}
          <MathJax.Inline text={'\\alpha=10^{-5} \\, K^{-1} '} /> and the
          thermal conductivity is equal to{' '}
          <MathJax.Inline text={'\\lambda=1 \\, W.m^{-1}.K^{-1}'} />.
        </p>
        <p>
          We impose a temperature of <MathJax.Inline text={'T= 303.15\\, K'} />{' '}
          on a face of the cube, so the temperature is constant in the cube and
          is equal to <MathJax.Inline text={'T= 303.15\\, K'} />. As all faces
          are fixed, then the total strain tensor is zero{' '}
          <MathJax.Inline text={'\\epsilon= 0'} /> and
          <MathJax.Formula
            text={`         
            \\epsilon^{m}=  - \\epsilon^{th} = -\\alpha (T-T_{0}) I
          `}
          />
          therefore
          <MathJax.Formula
            text={`         
            \\sigma=  - (2\\mu + 3\\lambda) \\alpha (T-T_{0}) I
          `}
          />
          We conclude that{' '}
          <MathJax.Inline
            text={
              '\\sigma_{11} = \\sigma_{22} =\\sigma_{33} = -5.25 \\times 10^{7} \\, Pa'
            }
          />
          .
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
              src: '/blog/6-thermalExpansion/meshCube.jpg',
              caption: 'Geometry and Mesh'
            },
            {
              key: 'temperature',
              src: '/blog/6-thermalExpansion/temperature.jpg',
              caption: 'Temperature'
            },
            {
              key: 'stress11',
              src: '/blog/6-thermalExpansion/sigma11.jpg',
              caption: 'Sigma11'
            },
            {
              key: 'stress22',
              src: '/blog/6-thermalExpansion/sigma22.jpg',
              caption: 'Sigma22'
            },
            {
              key: 'stress33',
              src: '/blog/6-thermalExpansion/sigma33.jpg',
              caption: 'Sigma33'
            }
          ]}
        />
      </section>
    </PostLayout>
  )
}

export default Post
