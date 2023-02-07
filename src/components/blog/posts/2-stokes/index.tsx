/** @module Components.Blog.Posts.2Stokes */

import { Carousel, Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'

import PostLayout from '../layout'

export const key = '2-stokes'
export const title = "Stokes's problem"
export const description = 'A simple Stokes problem example'
export const image = '/images/Stokes.png'
export const date = '2023-01-31'
export const keywords = ['Stokes', 'Tutorial', 'Fluid']
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
          Here we will solve the Stokes equation:
          <MathJax.Formula
            text={'\\mu\\Delta\\mathbf{u} - \\nabla p = \\mathbf{f}'}
          />
          <MathJax.Formula text={'\\text{div}(\\mathbf{u}) = 0'} />
          Where <MathJax.Inline text={'\\mathbf{u}'} /> is the unknow velocity,{' '}
          <MathJax.Inline text={'p'} /> is the unknow pressure and{' '}
          <MathJax.Inline text={'\\mathbf{f}'} /> an external force
        </p>
        <p>
          <a
            href="https://en.wikipedia.org/wiki/Stokes_flow"
            target="_blank"
            rel="noreferrer"
          >
            Wikipedia
          </a>
        </p>
      </section>

      <section>
        <p>
          We will solve our problem on a 2D pipe geometry{' '}
          <MathJax.Inline text={'[0, 0.1]\\times[0, 0.03]'} /> with a step
        </p>
      </section>

      <section>
        We will use the same workspace as the previous post
        <Typography.Title level={3}>Project Creation</Typography.Title>
        <p>We will create the Stokes problem project</p>
        <Carousel effect="fade">
          <div>
            <img src="/blog/2-stokes/project1.jpg" alt="Project creation" />
          </div>
          <div>
            <img src="/blog/2-stokes/project2.jpg" alt="Project creation" />
          </div>
        </Carousel>
      </section>

      <section>
        <Typography.Title level={3}>Geometry Import</Typography.Title>
        <p>We can now import our geometry</p>
        <p>
          As we want to solve a 2D problem, we will load a DXF file:{' '}
          <Typography.Text code>
            <a href="/blog/2-stokes/pipe_2D.dxf" download>
              pipe_2D.dxf
            </a>
          </Typography.Text>
        </p>
        <p>
          Just drag and drop a DXF file in the uploader, or directly choose a
          file in your file manager
        </p>
        <p>Here we can see the number of edges</p>
        <Carousel effect="fade">
          <div>
            <img src="/blog/2-stokes/geometry1.jpg" alt="Geometry import" />
          </div>
          <div>
            <img src="/blog/2-stokes/geometry2.jpg" alt="Geometry import" />
          </div>
        </Carousel>
      </section>

      <section>
        <Typography.Title level={3}>Create Simulation</Typography.Title>
        <p>
          We click on &quot;New Simulation&quot;, select Stokes and create it
        </p>
        <Carousel effect="fade">
          <div>
            <img
              src="/blog/2-stokes/simulation1.jpg"
              alt="Simulation creation"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation2.jpg"
              alt="Simulation creation"
            />
          </div>
        </Carousel>
      </section>

      <section>
        <Typography.Title level={3}>
          Simulation Parameterization
        </Typography.Title>
        <Typography.Title level={5}>Geometry</Typography.Title>
        <p>In the Stokes simulation menu, click on Geometry</p>
        <p>
          As we have only one geometry, it is automatically selected. We will
          keep the mesh refinement automatic and with a normal size.
        </p>
        <div className="img-container">
          <img
            src="/blog/2-stokes/simulation_param_geometry.jpg"
            alt="Simulation parametrization geometry"
          />
        </div>

        <Typography.Title level={5}>Material</Typography.Title>
        <p>Click on Materials, Add material</p>
        <p>
          We will select the Water parameters directly in the material database,
          using &apos;Pick a material&apos; button, and select the face
        </p>
        <Carousel effect="fade">
          <div>
            <img
              src="/blog/2-stokes/simulation_param_material1.jpg"
              alt="Simulation parameterization material"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_material2.jpg"
              alt="Simulation parameterization material"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_material3.jpg"
              alt="Simulation parameterization material"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_material4.jpg"
              alt="Simulation parameterization material"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_material5.jpg"
              alt="Simulation parameterization material"
            />
          </div>
        </Carousel>

        {/*  */}
        {/*  */}
        {/*  */}

        <Typography.Title level={5}>Parameters</Typography.Title>
        <p>Click on Parameters</p>
        <p>We will keep all default parameters</p>
        <Carousel effect="fade">
          <div>
            <img
              src="/blog/2-stokes/simulation_param_parameters1.jpg"
              alt="Simulation parametrization parameters"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_parameters2.jpg"
              alt="Simulation parametrization parameters"
            />
          </div>
        </Carousel>

        <Typography.Title level={5}>Boundary Conditions</Typography.Title>
        <p>Click on Boundary conditions</p>
        <p>
          We will add a Wall boundary condition:
          <MathJax.Formula
            text={'\\mathbf{u} = \\mathbf{0}\\text{ on }\\{2,3,4,5,6,8\\}'}
          />
        </p>
        <p>
          And a velocity boundary condition:
          <MathJax.Formula
            text={
              '\\mathbf{u} = \\left(1 - \\left(\\frac{(y-0.015)^2}{0.015^2}\\right)\\right)\\mathbf{e}_x\\text{ on }\\{1\\}'
            }
          />
        </p>
        <Carousel effect="fade">
          <div>
            <img
              src="/blog/2-stokes/simulation_param_boundaryconditions1.jpg"
              alt="Simulation parametrization boundary conditions"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_boundaryconditions2.jpg"
              alt="Simulation parametrization boundary conditions"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_boundaryconditions3.jpg"
              alt="Simulation parametrization boundary conditions"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_boundaryconditions4.jpg"
              alt="Simulation parametrization boundary conditions"
            />
          </div>
        </Carousel>

        <Typography.Title level={5}>Run</Typography.Title>
        <p>Click on Run</p>
        <p>We will choose the &quot;Local Computing&quot; ressource</p>
        <p>
          Finally, we will click on run to start the mesh process and simulation
        </p>
        <Carousel effect="fade">
          <div>
            <img
              src="/blog/2-stokes/simulation_param_run1.jpg"
              alt="Simulation parametrization run"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_run2.jpg"
              alt="Simulation parametrization run"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_run3.jpg"
              alt="Simulation parametrization run"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_run4.jpg"
              alt="Simulation parametrization run"
            />
          </div>
        </Carousel>

        <Typography.Title level={5}>Run - Mesh visualization</Typography.Title>
        <p>
          We will click on the closed eye near the Mesh result to display the
          mesh
        </p>
        <div className="img-container">
          <img
            src="/blog/2-stokes/simulation_param_run_mesh.jpg"
            alt="Simulation parametrization run mesh"
          />
        </div>

        <Typography.Title level={5}>
          Run - Result visualization
        </Typography.Title>
        <p>
          We will click on the closed eye near the &apos;Velocity
          (magnitude)&apos; result (for example) to display the result of the
          velocity magnitude
        </p>
        <p>
          We can disable result mesh visualization using the switch on the right
        </p>
        <Carousel effect="fade">
          <div>
            <img
              src="/blog/2-stokes/simulation_param_run_result1.jpg"
              alt="Simulation parametrization run result"
            />
          </div>
          <div>
            <img
              src="/blog/2-stokes/simulation_param_run_result2.jpg"
              alt="Simulation parametrization run result"
            />
          </div>
        </Carousel>
      </section>
    </PostLayout>
  )
}

export default Post
