/** @module Components.Doc.Project */

import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Button, Switch, Tabs, Typography } from 'antd'
import {
  BorderlessTableOutlined,
  CloseSquareOutlined,
  CompressOutlined,
  DownloadOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  LineChartOutlined,
  PlusSquareOutlined,
  RadarChartOutlined,
  RadiusUprightOutlined,
  RetweetOutlined,
  ScissorOutlined,
  SelectOutlined,
  StopOutlined,
  SwapOutlined,
  TableOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons'

import { AddButton } from '@/components/assets/button'
import Carousel from '@/components/assets/carousel'

import style from '../index.module.css'

/**
 * Geometry
 * @returns Geometry
 */
const Geometry = (): React.JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={4}>Geometry</Typography.Title>
      <Typography className={style.text}>
        <Typography.Text>
          The first step when you open a new project is to import a geometry
        </Typography.Text>
        <Typography.Text>
          For now, Tanatloc supports STEP files, for 3D parts, and DXF files,
          for 2D parts
        </Typography.Text>
        <Typography.Text>
          The uploader is open by default when there is no geometry in your
          project, just drag and drop your file and click and choose a file
        </Typography.Text>
        <Typography.Text>
          Here is an example with a cube geometry (
          <a href="/doc/cube.stp" download>
            STEP file
          </a>
          )
        </Typography.Text>
        <Typography.Text>
          You can download, edit the name and delete the geometry
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'upload',
            src: '/doc/project_geometry1.jpg',
            caption: 'Upload a geometry'
          },
          {
            key: 'geometry',
            src: '/doc/project_geometry2.jpg',
            caption: 'Geometry display'
          }
        ]}
      />
      <Typography className={style.text}>
        <Typography.Text className={style.warnings}>
          For the DXF upload, make sure your geometry is in the X-Y plane
        </Typography.Text>
      </Typography>
    </>
  )
}

/**
 * Simulation
 * @returns Simulation
 */
const Simulation = (): React.JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={4}>Simulation</Typography.Title>
      <Typography className={style.text}>
        <Typography.Text>
          You can create a new simulation using{' '}
          <AddButton primary={false} onAdd={() => undefined}>
            New Simulation
          </AddButton>
        </Typography.Text>
        <Typography.Text>
          Here we select a linear elasticity time dependant problem
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'list',
            src: '/doc/project_simulation_list.jpg',
            caption: 'Simulations list'
          },
          {
            key: 'create',
            src: '/doc/project_simulation_create.jpg',
            caption: 'Create simulation'
          },
          {
            key: 'show',
            src: '/doc/project_simulation_show.jpg',
            caption: 'Simulation'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={5}>Geometry</Typography.Title>
        <Typography.Text>
          You have to click on the Geometry menu to select the geometry
        </Typography.Text>
        <Typography.Text>
          If only one geometry has been uploaded, it is selected by default
        </Typography.Text>
        <Typography.Text>
          You can choose the mesh refinement type and size:
          <ul>
            <li>
              Automatic type
              <ul>
                <li>Very fine</li>
                <li>Fine</li>
                <li>Normal</li>
                <li>Coarse</li>
                <li>Very coarse</li>
              </ul>
            </li>
            <li>
              Manual type
              <ul>
                <li>Enter a value</li>
              </ul>
            </li>
          </ul>
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'geometry',
            src: '/doc/project_simulation_geometry.jpg',
            caption: 'Simulation geometry'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={5}>Materials</Typography.Title>
        <Typography.Text>
          Depending on your simulation, you may have to choose a material
        </Typography.Text>
        <Typography.Text>
          Click on the Material menu, and{' '}
          <AddButton primary={false} onAdd={() => undefined}>
            Add material
          </AddButton>
        </Typography.Text>
        <Typography.Text>
          Select a material using the database (Pick a material) and by directly
          filling the material properties
        </Typography.Text>
        <Typography.Text>Select solids to assign the material</Typography.Text>
        <Typography.Text>Click on Add to create the material</Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'materials',
            src: '/doc/project_simulation_materials.jpg',
            caption: 'Simulation materials'
          },
          {
            key: 'create',
            src: '/doc/project_simulation_materials_create.jpg',
            caption: 'Material create'
          },
          {
            key: 'database',
            src: '/doc/project_simulation_materials_database.jpg',
            caption: 'Material database'
          },
          {
            key: 'select',
            src: '/doc/project_simulation_materials_select.jpg',
            caption: 'Material solid selection'
          },
          {
            key: 'list',
            src: '/doc/project_simulation_materials_list.jpg',
            caption: 'Materials list'
          }
        ]}
      />
      <Typography className={style.text}>
        <Typography.Text className={style.tips}>
          Selector buttons:
          <ul>
            <li>
              <Button icon={<PlusSquareOutlined />} /> Select all entities
            </li>
            <li>
              <Button icon={<CloseSquareOutlined />} /> Unselect all entities
            </li>
            <li>
              <Button icon={<SwapOutlined />} /> Swap entities
            </li>
          </ul>
        </Typography.Text>
        <Typography.Text className={style.tips}>
          If you design your STEP file with color, you will be able to select by
          group of color with the selector
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={5}>Parameters</Typography.Title>
        <Typography.Text>Click on the Parameters menu</Typography.Text>
        <Typography.Text>Parameters depends on your simulation</Typography.Text>
        <Typography.Text>
          There are standard parameters, and advanced parameters
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'parameters',
            src: '/doc/project_simulation_parameters.jpg',
            caption: 'Simulation parameters'
          },
          {
            key: 'adanced',
            src: '/doc/project_simulation_parameters_advanced.jpg',
            caption: 'Simulation advanced parameters'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={5}>Boundary Conditions</Typography.Title>
        <Typography.Text>Click on Boundary conditions menu</Typography.Text>
        <Typography.Text>
          Click on{' '}
          <AddButton primary={false} onAdd={() => undefined}>
            Add boundary condition
          </AddButton>
        </Typography.Text>
        <Typography.Text>
          Select the type of boundary condition, fill the values if necessary
          and select the face to impose the boundary condition
        </Typography.Text>
        <Typography.Text>Click on Add to create it</Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'boundaryConditions',
            src: '/doc/project_simulation_boundaryConditions.jpg',
            caption: 'Boundary conditions'
          },
          {
            key: 'create',
            src: '/doc/project_simulation_boundaryConditions_create.jpg',
            caption: 'Create boundary condition'
          },
          {
            key: 'add',
            src: '/doc/project_simulation_boundaryConditions_add.jpg',
            caption: 'Add boundary condition'
          },
          {
            key: 'list',
            src: '/doc/project_simulation_boundaryConditions_list.jpg',
            caption: 'Boundary conditions list'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={5}>Run</Typography.Title>
        <Typography.Text>
          You can add a sensor before running the computation to extract data
          during the simulation process using{' '}
          <AddButton onAdd={() => undefined}>Add a sensor</AddButton>
        </Typography.Text>
        <Typography.Text>
          You have to select a computational resource. The local plugin is
          enabled by defaut in the Desktop application. In the web application,
          you must select an HPC provider
        </Typography.Text>
        <Typography.Text>
          Once run is ready, click on Run to launch the meshing and simulation
        </Typography.Text>
        <Typography.Text>
          Results and data are displayed when available during the simulation
          execution
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'run',
            src: '/doc/project_simulation_run.jpg',
            caption: 'Run'
          },
          {
            key: 'sensor',
            src: '/doc/project_simulation_run_sensor.jpg',
            caption: 'Sensor'
          },
          {
            key: 'resource',
            src: '/doc/project_simulation_run_resource.jpg',
            caption: 'Computational resource'
          },
          {
            key: 'ready',
            src: '/doc/project_simulation_run_ready.jpg',
            caption: 'Ready to run'
          },
          {
            key: 'results',
            src: '/doc/project_simulation_run_results.jpg',
            caption: 'Results'
          }
        ]}
      />
      <Typography className={style.text}>
        <Typography.Text>
          You can have a look on the output log of meshing and simulation using{' '}
          <Button icon={<FileTextOutlined />} />
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'log',
            src: 'doc/project_simulation_run_log.jpg',
            caption: 'Run log'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={5}>Run summary</Typography.Title>
        <Typography.Text>
          You can download the simulation run summary using{' '}
          <Button icon={<DownloadOutlined />} />
        </Typography.Text>
        <Typography.Text>
          If your simulation is time-dependant, a pvd file will be included to
          allow you to postprocess the result with Paraview
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'summary',
            src: 'doc/project_simulation_summary.jpg',
            caption: 'Simulation run summary'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={5}>Mesh</Typography.Title>
        <Typography.Text>
          To display the mesh, click on{' '}
          <Button icon={<EyeInvisibleOutlined />} /> button before Mesh
        </Typography.Text>
        <Typography.Text>
          To download the mesh (file .msh), click on{' '}
          <Button icon={<DownloadOutlined />} />
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'mesh',
            src: 'doc/project_simulation_mesh.jpg',
            caption: 'Mesh'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={5}>Result</Typography.Title>
        <Typography.Text>
          To display a result, click on{' '}
          <Button icon={<EyeInvisibleOutlined />} /> near the result you want to
          display
        </Typography.Text>
        <Typography.Text>
          To download the result (file .vtu), click on{' '}
          <Button icon={<DownloadOutlined />} />
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'result',
            src: 'doc/project_simulation_result.jpg',
            caption: 'Simulation result'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={5}>Data</Typography.Title>
        <Typography.Text>
          To display the data, click on{' '}
          <Button type="primary" icon={<LineChartOutlined />} shape="circle" />
        </Typography.Text>
        <Typography.Text>
          You can see data directly computed in the simulation and the sensors
          you define before the run
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'button',
            src: 'doc/project_simulation_data_button.jpg',
            caption: 'Data visualization button'
          },
          {
            key: 'data',
            src: 'doc/project_simulation_data.jpg',
            caption: 'Data'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={5}>Post-processing</Typography.Title>
        <Typography.Text>
          To display the post-processing tools, click on{' '}
          <Button type="primary" icon={<RadarChartOutlined />} shape="circle" />
        </Typography.Text>
        <Typography.Text>
          Depending on the simulation, you can select post-processing filter and
          run the post-processing. Once computed, you can display the result
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'button',
            src: 'doc/project_simulation_postprocessing_button.jpg',
            caption: 'Post-processing button'
          },
          {
            key: 'postprocessing',
            src: 'doc/project_simulation_postprocessing.jpg',
            caption: 'Post-processing'
          },
          {
            key: 'result',
            src: 'doc/project_simulation_postprocessing_view.jpg',
            caption: 'Post-processing result'
          }
        ]}
      />
    </>
  )
}

/**
 * View
 * @returns View
 */
const View = (): React.JSX.Element => {
  return (
    <>
      <Typography.Title level={4}>View Tools</Typography.Title>
      <Typography className={style.text}>
        <Typography.Text>
          There are some visualization tools on the right of the project screen
        </Typography.Text>
        <Typography.Text>
          In the default mode, there is:
          <ul>
            <li>
              <Button icon={<FundProjectionScreenOutlined />} /> to take a
              snapshot to download, or to put on the project card, in the
              workspace
            </li>
            <li>
              <Switch
                defaultChecked
                checkedChildren={<BorderlessTableOutlined />}
                unCheckedChildren={<BorderlessTableOutlined />}
              />{' '}
              to switch the grid visibility
            </li>
            <li>
              <Switch
                defaultChecked={false}
                checkedChildren={<RadiusUprightOutlined />}
                unCheckedChildren={<RadiusUprightOutlined />}
              />{' '}
              to switch the transparency
            </li>
            <li>
              <Button icon={<ZoomOutOutlined />} /> to zoom out
            </li>
            <li>
              <Button icon={<ZoomInOutlined />} /> to zoom in
            </li>
            <li>
              <Button icon={<CompressOutlined />} /> to zoom to fit all the
              scene
            </li>
            <li>
              <Button icon={<SelectOutlined />} /> to zoom to selection
            </li>
            <li>
              <Button icon={<ScissorOutlined />} /> to start the section view
            </li>
          </ul>
        </Typography.Text>
        <Typography.Text>
          The section plane can be translated using the plane or rotated using
          the dome
          <ul>
            <li>
              <Button icon={<StopOutlined />} /> to stop the section view
            </li>
            <li>
              <Button icon={<EyeInvisibleOutlined />} /> to show/hide the
              section plane
            </li>
            <li>
              <Button>X</Button> to snap to X axis
            </li>
            <li>
              <Button>Y</Button> to snap to Y axis
            </li>
            <li>
              <Button>Z</Button> to snap to Z axis
            </li>
            <li>
              <Button icon={<RetweetOutlined />} /> to flip the section plane
            </li>
          </ul>
        </Typography.Text>
        <Typography.Text>
          When a result is displayed, the{' '}
          <Switch
            defaultChecked={true}
            checkedChildren={<TableOutlined />}
            unCheckedChildren={<TableOutlined />}
          />{' '}
          allows to show/hide the mesh
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'view',
            src: 'doc/project_view.jpg',
            caption: 'Default view'
          },
          {
            key: 'section',
            src: 'doc/project_view_section.jpg',
            caption: 'Section view'
          },
          {
            key: 'result',
            src: 'doc/project_view_result.jpg',
            caption: 'Results tools'
          }
        ]}
      />
    </>
  )
}

/**
 * Tabs
 */
const tabs = [
  {
    key: 'geometry',
    label: 'Geometry',
    children: <Geometry />
  },
  {
    key: 'simulation',
    label: 'Simulation',
    children: <Simulation />
  },
  {
    key: 'view',
    label: 'View tools',
    children: <View />
  }
]

/**
 * Project
 * @returns Project
 */
const Project = (): React.JSX.Element => {
  // Data
  const router = useRouter()
  const query = router.query

  /**
   * On change
   * @param key Key
   */
  const onChange = useCallback(
    (key: string) => {
      ;(async () => {
        await router.push({
          pathname: '/doc',
          query: {
            section: 'project',
            tab: key
          }
        })
      })()
    },
    [router]
  )

  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={3}>Project</Typography.Title>

      <Typography className={style.text}>
        <Typography.Text>
          The project is used to manage geometries, simulation and results.
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Open a project</Typography.Title>
        <Typography.Text>
          Just click on the project card to open it
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'project',
            src: '/doc/project_show.jpg',
            caption: 'Open a project'
          }
        ]}
      />

      <Tabs
        activeKey={(query.tab as string) ?? 'geometry'}
        items={tabs}
        onChange={onChange}
      />
    </>
  )
}

export default Project
