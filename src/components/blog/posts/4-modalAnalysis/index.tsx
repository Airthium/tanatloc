/** @module Components.Blog.Posts.4ModalAnalysis */

import { Table, Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'
import Carousel from '@/components/assets/carousel'

import PostLayout, { Ref } from '../layout'

const key = '2-ModalAnalysis'
const title = 'Modal Analysis problems'
const description = 'Validation tests, modal analysis'
const date = '2023-02-17'
const image = '/images/modalAnalysis.jpeg'
const keywords = ['Modal', 'Validation', 'Theory']
const author = {
  name: 'Houssam Houssein',
  url: 'https://github.com/houssamh'
}

const references = [
  {
    code: '1',
    author: 'Code_Aster',
    date: '2020',
    label: 'SDLS109 - Eigen frequencies of a ring cylindrical thick'
  }
]

const dataAster = [
  {
    key: '1',
    mode: '6',
    frequency: 205.89
  },
  {
    key: '2',
    mode: '7',
    frequency: 205.89
  },
  {
    key: '3',
    mode: '8',
    frequency: 210.55
  },
  {
    key: '4',
    mode: '9',
    frequency: 210.55
  },

  {
    key: '5',
    mode: '10',
    frequency: 587.92
  },
  {
    key: '6',
    mode: '11',
    frequency: 587.92
  },
  {
    key: '7',
    mode: '12',
    frequency: 588.88
  },
  {
    key: '8',
    mode: '13',
    frequency: 588.88
  }
]

const columns = [
  {
    title: 'Mode',
    dataIndex: 'mode',
    key: 'mode'
  },
  {
    title: 'Frequency (Hz)',
    dataIndex: 'frequency',
    key: 'frequency'
  }
]

const dataTanatloc = [
  {
    key: '1',
    mode: '6',
    frequency: 205.221,
    error: 0.3
  },
  {
    key: '2',
    mode: '7',
    frequency: 205.222,
    error: 0.3
  },

  {
    key: '3',
    mode: '8',
    frequency: 210.029,
    error: 0.2
  },
  {
    key: '4',
    mode: '9',
    frequency: 210.029,
    error: 0.2
  },
  {
    key: '5',
    mode: '10',
    frequency: 586.385,
    error: 0.3
  },
  {
    key: '6',
    mode: '11',
    frequency: 586.385,
    error: 0.3
  },
  {
    key: '7',
    mode: '12',
    frequency: 587.126,
    error: 0.3
  },
  {
    key: '8',
    mode: '13',
    frequency: 587.128,
    error: 0.3
  }
]

const columnsWithErrors = [
  {
    title: 'Mode',
    dataIndex: 'mode',
    key: 'mode'
  },
  {
    title: 'Frequency (Hz)',
    dataIndex: 'frequency',
    key: 'frequency'
  },
  {
    title: 'Error (%)',
    dataIndex: 'error',
    key: 'error'
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
          The modal analysis consists in finding the eigenfrequencies and
          eigenvectors of a structure.
        </p>
        <p>
          Let <MathJax.Inline text={'K'} /> be the rigidity matrix of the
          structure and <MathJax.Inline text={'M'} /> its mass matrix. The
          eigenvalue problem reads as follows
          <MathJax.Formula text={'(K -\\lambda M) x =0'} />
          where <MathJax.Inline text={'\\lambda'} /> is the eigenvalue related
          to the natural frequency <MathJax.Inline text={'f'} /> by the
          following
          <MathJax.Formula text={'\\lambda=(2\\pi f)^{2}'} />
          and <MathJax.Inline text={'x'} /> the eigenvector for the mode of the
          frequency <MathJax.Inline text={'f'} />.
        </p>
        <p>
          Moreover the eigenvalue problem can be transformed as follows
          <MathJax.Formula text={'(A -\\sigma M)^{-1}Mx  = \\nu x'} />
          where
          <MathJax.Formula text={'\\nu  = \\frac{1}{\\lambda-\\sigma}'} />
          and <MathJax.Inline text={'\\sigma'} /> the shift of the method which
          helps to find eigenvalues near <MathJax.Inline text={'\\sigma'} />. By
          default <MathJax.Inline text={'\\sigma=0'} />.
        </p>
        <p>
          You can see{' '}
          <a href="https://freefem.org" target="_blank" rel="noreferrer">
            FreeFEM
          </a>
          {/**/}.
        </p>
      </section>
      <section>
        <Typography.Title level={3}>
          Validation test: The naural frequencies of an elastic ring
        </Typography.Title>

        <Typography.Title level={4}>Problem</Typography.Title>
        <p>
          Consider an elastic ring of height{' '}
          <MathJax.Inline text={'H=50 \\, mm'} />, the inner and the outer
          radius are respectively{' '}
          <MathJax.Inline text={'R_{inner}=345 \\, mm'} /> and{' '}
          <MathJax.Inline text={'R_{outer}=393 \\, mm'} />, see the figure
          above. We consider a Young&apos;s modulus{' '}
          <MathJax.Inline text={'E=185000 \\, MPa'} /> , a Poisson&apos;s ratio{' '}
          <MathJax.Inline text={'\\nu= 0.3'} /> and a density{' '}
          <MathJax.Inline text={'\\rho=7800 \\, kg.m^{-3} '} />. There is no
          boundary conditions, the ring is free.
        </p>
        <Carousel
          items={[
            {
              key: 'Geoproblem',
              src: '/blog/4-modalAnalysis/geometryRing.jpg',
              caption: 'Geometry of the problem'
            }
          ]}
        />
        <p>
          This validation test can be found in <Ref code="1" />, where for a
          refined mesh the first natural frequencies are presented in the
          following table
        </p>
        <Table pagination={false} dataSource={dataAster} columns={columns} />
        <p>
          Note that the modes <MathJax.Inline text={'0, \\ldots, 5'} />{' '}
          correspond to the rigid body modes and the corresponding frequencies
          are zeros.
        </p>
      </section>
      <section>
        <Typography.Title level={4}>Simulation and Results</Typography.Title>
        <p>
          Using Tanatloc, we create our geometry with the corresponding mesh
          (see Figures below) and we use P2 quadratic finite elements. We can
          also see in the Figures below some modes.
        </p>
        <Carousel
          items={[
            {
              key: 'MeshGeometry',
              src: '/blog/4-modalAnalysis/meshRing.jpg',
              caption: 'Geometry and Mesh'
            },
            {
              key: 'linearElastDisp',
              src: '/blog/4-modalAnalysis/mode6.jpg',
              caption: 'Mode 6'
            },
            {
              key: 'stressZz',
              src: '/blog/4-modalAnalysis/mode13.jpg',
              caption: 'Mode 13'
            }
          ]}
        />
        <p>
          Our computed frequencies are presented in the following table with the
          corresponding relative errors compared to <Ref code="1" />.
        </p>
        <Table
          pagination={false}
          dataSource={dataTanatloc}
          columns={columnsWithErrors}
        />
      </section>
    </PostLayout>
  )
}

const ModalAnalysis = {
  default: Post,
  key,
  title,
  description,
  date,
  image,
  keywords,
  author
}

export default ModalAnalysis
