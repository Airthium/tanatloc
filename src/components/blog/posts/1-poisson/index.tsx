/** @module Components.Blog.Posts.1Poisson */

import { Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'
import Carousel from '@/components/assets/carousel'

import PostLayout from '../layout'

export const key = '1-poisson'
export const title = "Poisson's problem"
export const description = "First example, the Poisson's problem"
export const date = '2023-01-30'
export const image = '/images/Poisson.png'
export const keywords = ['Tutorial', 'Academic']
export const author = {
  name: 'Simon Garnotel',
  url: 'https://github.com/sgarnotel'
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
        <p>
          Here we will solve a really simple equation, the{' '}
          <strong>Poisson&apos;s equation</strong>:
          <MathJax.Formula text={'\\Delta u = f'} />
          Where <MathJax.Inline text={'u'} /> is our unknow function and{' '}
          <MathJax.Inline text={'f'} /> is an external force
        </p>
        <p>
          <a
            href="https://en.wikipedia.org/wiki/Poisson%27s_equation"
            target="_blank"
            rel="noreferrer"
          >
            Wikipedia
          </a>
        </p>
      </section>

      <section>
        <p>
          We will solve our problem on a cube geometry{' '}
          <MathJax.Inline
            text={'[-0.16, 0.14]\\times[-0.14, 0.16]\\times[0, 0.3]'}
          />
        </p>
      </section>

      <section>
        <Typography.Title level={3}>Workspace Creation</Typography.Title>
        <p>So, let&apos;s start a new workspace</p>
        <Carousel
          items={[
            {
              key: 'workspace1',
              src: '/blog/1-poisson/workspace1.jpg',
              alt: 'Workspace creation'
            },
            {
              key: 'workspace2',
              src: '/blog/1-poisson/workspace2.jpg',
              alt: 'Workspace creation'
            },
            {
              key: 'workspace3',
              src: '/blog/1-poisson/workspace3.jpg',
              alt: 'Workspace creation'
            }
          ]}
        />
      </section>

      <section>
        <Typography.Title level={3}>Project Creation</Typography.Title>
        <p>Now, we will create the Poisson&apos;s problem project</p>
        <Carousel
          items={[
            {
              key: 'project1',
              src: '/blog/1-poisson/project1.jpg',
              alt: 'Project creation'
            },
            {
              key: 'project2',
              src: '/blog/1-poisson/project2.jpg',
              alt: 'Project creation'
            }
          ]}
        />
      </section>

      <section>
        <Typography.Title level={3}>Geometry Import</Typography.Title>
        <p>We can now import our geometry</p>
        <p>
          As we want to solve a 3D problem, we will load a STEP file:{' '}
          <Typography.Text code>
            <a href="/blog/1-poisson/cube.stp" download>
              cube.step
            </a>
          </Typography.Text>
        </p>
        <p>
          Just drag and drop a STEP file in the uploader, or directly choose a
          file in your file manager
        </p>
        <p>
          We can display some informations about the geometry: file name, unit,
          number of solids (for 3D objects), number of faces, number of edges
          (for 2D objects)
        </p>
        <Carousel
          items={[
            {
              key: 'project2',
              src: '/blog/1-poisson/project2.jpg',
              alt: 'Geometry import'
            },
            {
              key: 'geometry1',
              src: '/blog/1-poisson/geometry1.jpg',
              alt: 'Geometry import'
            },
            {
              key: 'geometry2',
              src: '/blog/1-poisson/geometry2.jpg',
              alt: 'Geometry import'
            }
          ]}
        />
      </section>

      <section>
        <Typography.Title level={3}>Create Simulation</Typography.Title>
        <p>
          We click on &quot;New Simulation&quot;, select Poisson&apos;s equation
          and create it
        </p>
        <Carousel
          items={[
            {
              key: 'simulation1',
              src: '/blog/1-poisson/simulation1.jpg',
              alt: 'Simulation creation'
            },
            {
              key: 'simulation2',
              src: '/blog/1-poisson/simulation2.jpg',
              alt: 'Simulation creation'
            }
          ]}
        />
      </section>

      <section>
        <Typography.Title level={3}>
          Simulation Parameterization
        </Typography.Title>
        <Typography.Title level={5}>Geometry</Typography.Title>
        <p>In the Poisson&apos;s equation simulation menu, click on Geometry</p>
        <p>
          As we have only one geometry, it is automatically selected. We will
          keep the mesh refinement automatic and with a normal size.
        </p>
        <Carousel
          items={[
            {
              key: 'geometry',
              src: '/blog/1-poisson/simulation_param_geometry.jpg',
              alt: 'Simulation parametrization geometry'
            }
          ]}
        />

        <Typography.Title level={5}>Parameters</Typography.Title>
        <p>Click on Parameters</p>
        <p>
          We will set external force <MathJax.Inline text={'f'} /> to 10
        </p>
        <p>
          In advanced parameters, we will set finite element space to{' '}
          <MathJax.Inline text={'P2'} />
        </p>
        <Carousel
          items={[
            {
              key: 'parameters1',
              src: '/blog/1-poisson/simulation_param_parameters1.jpg',
              alt: 'Simulation parametrization parameters'
            },
            {
              key: 'parameters2',
              src: '/blog/1-poisson/simulation_param_parameters2.jpg',
              alt: 'Simulation parametrization parameters'
            }
          ]}
        />

        <Typography.Title level={5}>Boundary Conditions</Typography.Title>
        <p>Click on Boundary conditions</p>
        <p>
          We will add a Dirichlet boundary condition:
          <MathJax.Formula text={'u = 1\\text{ on }\\{2\\}'} />
        </p>
        <Carousel
          items={[
            {
              key: 'boundaryConditions1',
              src: '/blog/1-poisson/simulation_param_boundaryconditions1.jpg',
              alt: 'Simulation parametrization boundary conditions'
            },
            {
              key: 'boundaryConditions2',
              src: '/blog/1-poisson/simulation_param_boundaryconditions2.jpg',
              alt: 'Simulation parametrization boundary conditions'
            },
            {
              key: 'boundaryConditions3',
              src: '/blog/1-poisson/simulation_param_boundaryconditions3.jpg',
              alt: 'Simulation parametrization boundary conditions'
            },
            {
              key: 'boudnaryConditions4',
              src: '/blog/1-poisson/simulation_param_boundaryconditions4.jpg',
              alt: 'Simulation parametrization boundary conditions'
            }
          ]}
        />

        <Typography.Title level={5}>Run</Typography.Title>
        <p>Click on Run</p>
        <p>
          We will add a sensor on point{' '}
          <MathJax.Inline text={'(0, 0, 0.015)'} /> to get the value of{' '}
          <MathJax.Inline text={'u'} />
        </p>
        <p>We will choose the &quot;Local Computing&quot; ressource</p>
        <p>
          Finally, we will click on run to start the mesh process and simulation
        </p>
        <Carousel
          items={[
            {
              key: 'run1',
              src: '/blog/1-poisson/simulation_param_run1.jpg',
              alt: 'Simulation parametrization run'
            },
            {
              key: 'run2',
              src: '/blog/1-poisson/simulation_param_run2.jpg',
              alt: 'Simulation parametrization run'
            },
            {
              key: 'run3',
              src: '/blog/1-poisson/simulation_param_run3.jpg',
              alt: 'Simulation parametrization run'
            },
            {
              key: 'run4',
              src: '/blog/1-poisson/simulation_param_run4.jpg',
              alt: 'Simulation parametrization run'
            },
            {
              key: 'run5',
              src: '/blog/1-poisson/simulation_param_run5.jpg',
              alt: 'Simulation parametrization run'
            }
          ]}
        />

        <Typography.Title level={5}>Run - Mesh visualization</Typography.Title>
        <p>
          We will click on the closed eye near the Mesh result to display the
          mesh
        </p>
        <Carousel
          items={[
            {
              key: 'mesh',
              src: '/blog/1-poisson/simulation_param_run_mesh.jpg',
              alt: 'Simulation parametrization run mesh'
            }
          ]}
        />

        <Typography.Title level={5}>
          Run - Result visualization
        </Typography.Title>
        <p>
          We will click on the closed eye near the <MathJax.Inline text={'u'} />{' '}
          result to display the result
        </p>
        <p>
          We can disable result mesh visualization using the switch on the right
        </p>
        <Carousel
          items={[
            {
              key: 'result1',
              src: '/blog/1-poisson/simulation_param_run_result1.jpg',
              alt: 'Simulation parametrization run result'
            },
            {
              key: 'result2',
              src: '/blog/1-poisson/simulation_param_run_result2.jpg',
              alt: 'Simulation parametrization run result'
            }
          ]}
        />

        <Typography.Title level={5}>
          Run - Sensor visualization
        </Typography.Title>
        <p>
          We can see the sensor output in the data visualization, using the
          round button on the bottom right.
        </p>
        <p>
          There is only one point because this algorithm is nor iterative, nor
          in time, so there is only one matrix resolution.
        </p>
        <Carousel
          items={[
            {
              key: 'sensor',
              src: '/blog/1-poisson/simulation_param_run_sensor.jpg',
              alt: 'Simulation parametrization run sensor'
            }
          ]}
        />
      </section>
    </PostLayout>
  )
}

export default Post
