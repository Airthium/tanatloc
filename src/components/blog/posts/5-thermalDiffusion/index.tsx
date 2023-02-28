/** @module Components.Blog.Posts.5ThermalDiffusion */

import { Table, Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'
import Carousel from '@/components/assets/carousel'

import PostLayout from '../layout'

export const key = '3-ThermalDiffusion'
export const title = 'Thermal diffusion problems'
export const description = 'Validation tests, thermal diffusion'
export const date = '2023-02-22'
export const image = '/images/thermalDiffusion.png'
export const keywords = ['Thermal diffusion', 'Validation', 'Theory']
export const author = {
  name: 'Houssam Houssein',
  url: 'https://github.com/houssamh'
}

const dataTanatloc = [
  {
    key: '1',
    temperature: 'T(0.25,0.25)',
    Tanatloc: 0.567,
    analytical: 0.567
  },
  {
    key: '2',
    temperature: 'T(0.75,0.25)',
    Tanatloc: 1.368,
    analytical: 1.368
  },

  {
    key: '3',
    temperature: 'T(0.75,0.75)',
    Tanatloc: 3.001,
    analytical: 3.001
  },
  {
    key: '4',
    temperature: 'T(0.25,0.75)',
    Tanatloc: 1.243,
    analytical: 1.243
  }
]

const columns = [
  {
    title: 'Temperatures',
    dataIndex: 'temperature',
    key: 'temperature'
  },
  {
    title: 'Tanatloc',
    dataIndex: 'Tanatloc',
    key: 'Tanatloc'
  },
  {
    title: 'Analytical',
    dataIndex: 'analytical',
    key: 'analytical'
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
    >
      <section>
        <Typography.Title level={3}>Theory</Typography.Title>
        <p>
          The thermal diffusion consists in solving the heat equation on a
          physical domain.
        </p>
        <p>
          Let <MathJax.Inline text={'\\Omega'} /> be a domain of{' '}
          <MathJax.Inline text={'\\mathbb{R}^{d}'} />, with{' '}
          <MathJax.Inline text={'d\\in\\{2,3\\}'} />, bounded by{' '}
          <MathJax.Inline text={'\\Gamma = \\Gamma_D \\cup \\Gamma_N'} />. Let{' '}
          <MathJax.Inline text={'T'} /> be the temperature in the physical
          domain <MathJax.Inline text={'\\Omega'} />, then the heat equation
          reads as follows
          <MathJax.Formula
            text={`         
            \\begin{align}
              \\rho C_p \\frac{\\partial T}{\\partial t} - \\lambda\\Delta T &= 0&\\text{on }\\Omega\\\\
              T &= T_D&\\text{on }\\Gamma_D\\\\
              \\lambda\\frac{\\partial T}{\\partial n} &= \\Phi_d&\\text{on }\\Gamma_N
            \\end{align}
          `}
          />
          with <MathJax.Inline text={'\\rho'} /> the density,{' '}
          <MathJax.Inline text={'C_{p}'} /> the heat capacity,{' '}
          <MathJax.Inline text={'\\lambda'} /> the thermal conductivity,{' '}
          <MathJax.Inline text={'T_{D}'} /> an imposed temperature and{' '}
          <MathJax.Inline text={'\\Phi_d'} /> an imposed heat flux.
        </p>
      </section>
      <section>
        <Typography.Title level={3}>
          Validation test: Temperature in a square
        </Typography.Title>

        <Typography.Title level={4}>Problem</Typography.Title>
        <p>
          In this example we consider the steady state of the heat equation, and
          we consider a square of dimensions{' '}
          <MathJax.Inline
            text={'[0 \\, m \\, , 1 \\, m]\\times[0 \\, m \\, , 1 \\, m]'}
          />
          , see the figure above, with a thermal conductivity{' '}
          <MathJax.Inline text={'\\lambda=1 \\, W.m^{-1}.K^{-1}'} />.
        </p>
        <Carousel
          items={[
            {
              key: 'Geoproblem',
              src: '/blog/5-thermalDiffusion/squareGeo.jpg',
              caption: 'Geometry of the problem'
            }
          ]}
        />
        <p>
          On the sides <MathJax.Inline text={'AB'} />,{' '}
          <MathJax.Inline text={'CD'} />, <MathJax.Inline text={'DA'} /> we
          impose temperatures, and on <MathJax.Inline text={'BC'} /> we impose a
          null heat flux, to obtain the following heat equation
          <MathJax.Formula
            text={`         
            \\begin{align}
              - &\\lambda\\Delta T = 0&\\text{on }\\Omega\\\\
              &T = sin(\\frac{\\pi}{2}x)&\\text{on }AB\\\\
              &T = sin(\\frac{\\pi}{2}x)e^{\\frac{\\pi}{2}}&\\text{on }CD\\\\
              &T = 0&\\text{on }DA\\\\
              &\\lambda\\frac{\\partial T}{\\partial n} = 0&\\text{on } BC
            \\end{align}
          `}
          />
          We can easily verify that the analytical solution is{' '}
          <MathJax.Inline
            text={'T(x,y)=sin(\\frac{\\pi}{2}x)e^{\\frac{\\pi}{2}y}'}
          />
          .
        </p>
      </section>
      <section>
        <Typography.Title level={4}>Simulation and Results</Typography.Title>
        <p>
          Using Tanatloc, we created our geometry with the corresponding mesh
          (see Figures below) and we used P1 linear finite elements. We can also
          see in the Figures below the computed temperature field.
        </p>
        <Carousel
          items={[
            {
              key: 'MeshGeometry',
              src: '/blog/5-thermalDiffusion/meshSquare.jpg',
              caption: 'Geometry and Mesh'
            },
            {
              key: 'temperature',
              src: '/blog/5-thermalDiffusion/temperature.jpg',
              caption: 'Temperature'
            }
          ]}
        />
        <p>
          In order to compare our computed temperature with the analytical one,
          we consider 4 points in the square, and we can compare in the
          following table, the values of the computed temperature at this four
          points with the analytical ones.
        </p>
        <Table dataSource={dataTanatloc} columns={columns} />
      </section>
    </PostLayout>
  )
}

export default Post
