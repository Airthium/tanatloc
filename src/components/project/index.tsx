/** @module Components.Project */

import { NextRouter, useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Button, Layout, Menu, Typography } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import {
  CodeSandboxOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'

import { ISimulation } from '@/database/simulation/index'
import { IModel } from '@/models/index.d'

import { GoBack } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import Loading from '@/components/loading'
import NotAuthorized from '@/components/notauthorized'

import SelectProvider from '@/context/select'

import {
  IFrontGeometriesItem,
  IFrontProject,
  IFrontNewSimulation,
  IFrontSimulationsItem,
  IFrontResult
} from '@/api/index.d'
import UserAPI from '@/api/user'
import ProjectAPI from '@/api/project'
import SimulationAPI from '@/api/simulation'
import GeometryAPI from '@/api/geometry'

import Panel from './panel'
import Geometry from './geometry'
import View from './view'
import Data from './data'
import Simulation from './simulation'

/**
 * Menu items
 */
export const menuItems = {
  dashboard: {
    key: 'dashboard'
  },
  geometries: {
    label: 'GEOMETRIES',
    key: 'geometries'
  },
  simulations: {
    label: 'SIMULATIONS',
    key: 'simulations'
  }
}

/**
 * Errors
 */
export const errors = {
  user: 'Unable to get user',
  project: 'Unable to get project',
  simulations: 'Unable to get simulations',
  geometries: 'Unable to get geometries',
  add: 'Unable to add a simulation'
}

/**
 * Handle dashboard
 * @param router Router
 * @param page Page
 * @param workspaceId Workspace id
 */
export const handleDashboard = (
  router: NextRouter,
  page?: string,
  workspaceId?: string
): void => {
  router.push({
    pathname: '/dashboard',
    query: { page, workspaceId }
  })
}

/**
 * On selector
 * @param project Project
 * @param scheme Simulation scheme
 * @param swr SWR
 */
export const onSelector = async (
  project: IFrontProject,
  scheme: IModel,
  swr: {
    addOneSimulation: (simulation: IFrontNewSimulation) => void
    mutateProject: (project: Partial<IFrontProject>) => void
  }
): Promise<void> => {
  try {
    // Add
    const simulation = await SimulationAPI.add(
      { id: project.id },
      { name: scheme.name, scheme }
    )

    // Mutate
    swr.addOneSimulation(simulation)
    swr.mutateProject({
      id: project.id,
      simulations: [...(project.simulations || []), simulation.id]
    })
  } catch (err) {
    ErrorNotification(errors.add, err)
    throw err
  }
}

/**
 * Project
 * @returns Project
 */
const Project = (): JSX.Element => {
  // Router
  const router = useRouter()
  const {
    page,
    workspaceId,
    projectId
  }: { page?: string; workspaceId?: string; projectId?: string } = router.query

  // State
  const [geometryAddVisible, setGeometryAddVisible] = useState<boolean>(false)
  const [geometry, setGeometry] = useState<IFrontGeometriesItem>()

  const [simulationSelectorVisible, setSimulationSelectorVisible] =
    useState<boolean>(false)
  const [simulation, setSimulation] = useState<IFrontSimulationsItem>()

  const [result, setResult] = useState<IFrontResult>()

  const [postprocessing, setPostprocessing] = useState<IFrontResult>()

  const [menuKey, setMenuKey] = useState<{
    key: string
    id: string
    item?: string
  }>()

  const [panel, setPanel] = useState<JSX.Element>()
  const [panelVisible, setPanelVisible] = useState<boolean>(true)

  // Data
  const [user, { errorUser, loadingUser }] = UserAPI.useUser()
  const [project, { mutateProject, errorProject, loadingProject }] =
    ProjectAPI.useProject(projectId)

  const [
    simulations,
    {
      addOneSimulation,
      delOneSimulation,
      mutateOneSimulation,
      errorSimulations,
      loadingSimulations
    }
  ] = SimulationAPI.useSimulations(project?.simulations)
  const [
    geometries,
    {
      addOneGeometry,
      delOneGeometry,
      mutateOneGeometry,
      errorGeometries,
      loadingGeometries
    }
  ] = GeometryAPI.useGeometries(project?.geometries)

  /**
   * On panel close
   */
  const onPanelClose = useCallback((): void => {
    setPanel(undefined)
    setMenuKey(undefined)
  }, [])

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser, router])

  // Errors
  useEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser)
    if (errorProject) ErrorNotification(errors.project, errorProject)
    if (errorSimulations)
      ErrorNotification(errors.simulations, errorSimulations)
    if (errorGeometries) ErrorNotification(errors.geometries, errorGeometries)
  }, [errorUser, errorProject, errorSimulations, errorGeometries])

  // Auto open geometry add
  useEffect(() => {
    if (!loadingProject && !loadingGeometries) {
      if (!geometries.length) setGeometryAddVisible(true)
      else setGeometryAddVisible(false)
    } else {
      setGeometryAddVisible(false)
    }
  }, [loadingProject, loadingGeometries, geometries])

  // Update geometry
  useEffect(() => {
    if (!loadingGeometries && geometry) {
      const current = geometries.find((g) => g.id === geometry?.id)
      if (current) {
        if (JSON.stringify(current) !== JSON.stringify(geometry))
          setGeometry(current)
      } else {
        setGeometry(undefined)
      }
    } else {
      setGeometry(geometries[0])
    }
  }, [geometries, geometry, loadingGeometries, setGeometry])

  // Update simulation
  useEffect(() => {
    if (!loadingSimulations && simulation) {
      const current = simulations.find((s) => s.id === simulation?.id)
      if (current) {
        if (JSON.stringify(current) !== JSON.stringify(simulation))
          setSimulation(current)
      } else {
        onPanelClose()
        setSimulation(undefined)
      }
    }
  }, [simulations, simulation, loadingSimulations, setSimulation, onPanelClose])

  /**
   * On geometry cleanup
   */
  const onGeometryCleanup = useCallback((): void => {
    setGeometry({ id: '0', needCleanup: true } as IFrontGeometriesItem)
  }, [])

  /**
   * Set geometry panel
   * @param id Geometry id
   */
  const setGeometryPanel = useCallback(
    (id: string): void => {
      const current = geometries.find((g) => g.id === id)
      if (!current) return

      setGeometry(current)
      setPanel(
        <Panel visible={true} title={'Geometry'} onClose={onPanelClose}>
          <Geometry
            project={{
              id: project.id,
              geometries: project.geometries
            }}
            geometry={{
              id: current.id,
              name: current.name,
              summary: current.summary
            }}
            swr={{ mutateProject, mutateOneGeometry, delOneGeometry }}
            close={onPanelClose}
            onCleanup={onGeometryCleanup}
          />
        </Panel>
      )
    },
    [
      project,
      geometries,
      mutateProject,
      mutateOneGeometry,
      delOneGeometry,
      onGeometryCleanup,
      onPanelClose
    ]
  )

  /**
   * Set simulation panel About
   * @param current Current simulation
   */
  const setSimulationPanelAbout = useCallback(
    (current: ISimulation): void => {
      setPanel(
        <Panel visible={true} title={'About'} onClose={onPanelClose}>
          <Simulation.About
            project={{
              id: project.id,
              simulations: project.simulations
            }}
            simulation={{
              id: current.id,
              name: current.name,
              scheme: current.scheme
            }}
            swr={{
              mutateProject,
              addOneSimulation,
              delOneSimulation,
              mutateOneSimulation
            }}
          />
        </Panel>
      )
    },
    [
      project,
      mutateProject,
      addOneSimulation,
      delOneSimulation,
      mutateOneSimulation,
      onPanelClose
    ]
  )

  /**
   * Set simulation panel Geometry
   * @param current Current simulation
   */
  const setSimulationPanelGeometry = useCallback(
    (current: ISimulation): void => {
      setPanel(
        <Panel visible={true} title={'Geometry'} onClose={onPanelClose}>
          <Simulation.Geometry
            geometries={geometries}
            geometry={
              geometry && {
                id: geometry.id,
                summary: geometry.summary
              }
            }
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            setGeometry={setGeometry}
            swr={{ mutateOneSimulation }}
          />
        </Panel>
      )
    },
    [geometries, geometry, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Parameters
   * @param current Current simulation
   */
  const setSimulationPanelParameters = useCallback(
    (current: ISimulation): void => {
      setPanel(
        <Panel visible={true} title={'Parameters'} onClose={onPanelClose}>
          <Simulation.Parameters
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            swr={{ mutateOneSimulation }}
          />
        </Panel>
      )
    },
    [mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Materials
   * @param current Current simulation
   */
  const setSimulationPanelMaterials = useCallback(
    (current: ISimulation): void => {
      setPanel(
        <Panel
          visible={panelVisible}
          title={'Materials'}
          onClose={onPanelClose}
        >
          <Simulation.Materials
            geometry={
              geometry && {
                id: geometry.id,
                summary: geometry.summary
              }
            }
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            swr={{
              mutateOneSimulation
            }}
            setVisible={(visible) => setPanelVisible(visible)}
          />
        </Panel>
      )
    },
    [geometry, panelVisible, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Initialization
   * @param current Current simulation
   */
  const setSimulationPanelInitialization = useCallback(
    (current: ISimulation): void => {
      setPanel(
        <Panel visible={true} title={'Initialization'} onClose={onPanelClose}>
          <Simulation.Initialization
            simulations={simulations}
            simulation={current}
            swr={{ mutateOneSimulation }}
          />
        </Panel>
      )
    },
    [simulations, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Boundary conditions
   * @param current Current simulation
   */
  const setSimulationPanelBoundaryConditions = useCallback(
    (current: ISimulation): void => {
      setPanel(
        <Panel
          visible={panelVisible}
          title={'Boundary conditions'}
          onClose={onPanelClose}
        >
          <Simulation.BoundaryConditions
            geometry={
              geometry && {
                id: geometry.id,
                summary: geometry.summary
              }
            }
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            swr={{
              mutateOneSimulation
            }}
            setVisible={(visible) => setPanelVisible(visible)}
          />
        </Panel>
      )
    },
    [geometry, panelVisible, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Run
   * @param current Current simulation
   */
  const setSimulationPanelRun = useCallback(
    (current: ISimulation): void => {
      setPanel(
        <Panel visible={panelVisible} title={'Run'} onClose={onPanelClose}>
          <Simulation.Run
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            result={
              result && {
                name: result.name,
                fileName: result.fileName
              }
            }
            setResult={setResult}
            setVisible={(visible) => setPanelVisible(visible)}
            swr={{ mutateOneSimulation }}
          />
        </Panel>
      )
    },
    [result, panelVisible, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel
   * @param id Simulation id
   * @param item Item
   */
  const setSimulationPanel = useCallback(
    (id: string, item: string) => {
      const current = simulations.find((s) => s.id === id)
      if (!current) return

      setSimulation(current)

      const geometryId = current.scheme?.configuration?.geometry?.value
      if (geometryId && geometry?.id !== geometryId) {
        const currentGeometry = geometries.find((g) => g.id === geometryId)
        if (currentGeometry) setGeometry(currentGeometry)
      }

      switch (item) {
        case 'about':
          setSimulationPanelAbout(current)
          break
        case 'geometry':
          setSimulationPanelGeometry(current)
          break
        case 'parameters':
          setSimulationPanelParameters(current)
          break
        case 'materials':
          setSimulationPanelMaterials(current)
          break
        case 'initialization':
          setSimulationPanelInitialization(current)
          break
        case 'boundaryConditions':
          setSimulationPanelBoundaryConditions(current)
          break
        case 'run':
          setSimulationPanelRun(current)
          break
        default:
          setPanel(undefined)
      }
    },
    [
      geometry,
      geometries,
      simulations,
      setSimulationPanelAbout,
      setSimulationPanelGeometry,
      setSimulationPanelParameters,
      setSimulationPanelMaterials,
      setSimulationPanelInitialization,
      setSimulationPanelBoundaryConditions,
      setSimulationPanelRun
    ]
  )

  // Panel
  useEffect(() => {
    if (!menuKey) return

    if (menuKey.key === menuItems.geometries.key) {
      setGeometryPanel(menuKey.id)
    } else {
      //menuKey.key === menuItems.simulations.key)
      setSimulationPanel(menuKey.id, menuKey.item!)

      // Force geometry
      if (menuKey.item !== 'run') {
        setResult(undefined)
        setPostprocessing(undefined)
      }
    }
  }, [menuKey, setGeometryPanel, setSimulationPanel, onPanelClose])

  // Close result
  useEffect(() => {
    if (!result && postprocessing) setPostprocessing(undefined)
  }, [result, postprocessing])

  /**
   * On menu click
   * @param data Data
   */
  const onMenuClick = useCallback(
    ({ keyPath }: { keyPath: string[] }): void => {
      const key = keyPath.pop() as string
      const subKey = keyPath.pop() as string
      const subSubKey = keyPath.pop()

      let item
      if (subSubKey) {
        item = subSubKey.split('&').pop()
      }

      setMenuKey({
        key,
        id: subKey,
        item
      })
    },
    []
  )

  // Geometries render build
  const geometriesRender = geometries.map((g) => ({
    key: g.id,
    icon: <PieChartOutlined />,
    label: g.name
  }))

  // Simulations render build
  const simulationsRender = simulations.map((s) => {
    const configuration = s.scheme.configuration || {}
    const categories: ItemType[] = []
    Object.keys(configuration).forEach((key) => {
      if (key === 'dimension') return
      const child = configuration[key]
      let icon = <CheckCircleOutlined style={{ color: 'green' }} />
      if (child.error) icon = <CloseCircleOutlined style={{ color: 'red' }} />
      if (!child.done)
        icon = <ExclamationCircleOutlined style={{ color: 'orange' }} />

      // Deleted simulation's geometry
      if (
        key === 'geometry' &&
        !geometries.filter((g) => g.id === child.value).length &&
        !loadingGeometries
      ) {
        icon = <ExclamationCircleOutlined style={{ color: 'orange' }} />
        child.done = null
      }

      categories[child.index] = {
        key: s.id + '&' + key,
        className: 'Project-Menu-SubMenu-Simulations-SubMenu-MenuItem',
        disabled: !geometries.length,
        icon: icon,
        label: child.title
      }
    })
    return {
      key: s.id,
      className: 'Project-Menu-SubMenu-Simulations-SubMenu',
      icon: <CodeSandboxOutlined />,
      label: s.name,
      children: [
        {
          key: s.id + '&about',
          className: 'Project-Menu-SubMenu-Simulations-SubMenu-MenuItem',
          disabled: !geometries.length,
          icon: <CheckCircleOutlined style={{ color: 'green' }} />,
          label: 'About'
        },
        ...categories
      ]
    }
  })

  /**
   * Render
   */
  if (!user || loadingUser || loadingProject) return <Loading.Simple />
  if (project.id === '0') return <NotAuthorized />
  return (
    <SelectProvider>
      <Layout hasSider={true}>
        <Layout.Sider theme="light" className="Project-Sider" width={256}>
          <div className="logo">
            <img src="/images/logo.svg" alt="Tanatloc" />
          </div>
          <Menu
            mode="inline"
            items={[
              {
                key: 'menu-go-back',
                disabled: true,
                className: 'Project-Menu-GoBack',
                style: { cursor: 'unset', margin: '10px 0', paddingLeft: 10 },
                label: (
                  <GoBack
                    onClick={() => handleDashboard(router, page, workspaceId)}
                  >
                    Return to dashboard
                  </GoBack>
                )
              },
              {
                type: 'divider',
                className: 'Project-Menu-Divider'
              },
              {
                key: 'title',
                disabled: true,
                className: 'Project-Menu-Title',
                label: (
                  <Typography.Paragraph ellipsis={{ tooltip: true, rows: 1 }}>
                    {project.title}
                  </Typography.Paragraph>
                )
              }
            ]}
          />
          <div className="Project-Menu-scroll">
            <Menu
              className="Project-Menu"
              mode="inline"
              defaultOpenKeys={[
                menuItems.geometries.key,
                menuItems.simulations.key
              ]}
              items={[
                {
                  key: menuItems.geometries.key,
                  className: 'Project-Menu-SubMenu-Geometries',
                  icon: loadingGeometries ? (
                    <LoadingOutlined />
                  ) : (
                    <PieChartOutlined />
                  ),
                  label: (
                    <Typography.Text strong>
                      {menuItems.geometries.label} ({geometries.length})
                    </Typography.Text>
                  ),
                  children: [
                    {
                      key: 'new_geometry',
                      className: 'Project-Menu-SubMenu-Geometries-New',
                      disabled: true,
                      label: (
                        <Button
                          icon={<UploadOutlined />}
                          onClick={() => setGeometryAddVisible(true)}
                        >
                          New Geometry
                        </Button>
                      )
                    },
                    {
                      key: 'geometry-needed',
                      className:
                        'text-dark ' +
                        (geometries.length ? 'display-none' : ''),
                      disabled: true,
                      icon: (
                        <ExclamationCircleOutlined style={{ color: 'red' }} />
                      ),
                      label: 'A Geometry is needed'
                    },
                    ...geometriesRender
                  ]
                },
                {
                  key: menuItems.simulations.key,
                  className: 'Project-Menu-SubMenu-Simulations',
                  icon: loadingSimulations ? (
                    <LoadingOutlined />
                  ) : (
                    <CodeSandboxOutlined />
                  ),
                  label: (
                    <Typography.Text strong>
                      {menuItems.simulations.label} ({simulations.length})
                    </Typography.Text>
                  ),
                  children: [
                    {
                      key: 'new_simulation',
                      className: 'Project-Menu-SubMenu-Simulations-New',
                      disabled: true,
                      label: (
                        <Button
                          disabled={!geometries.length}
                          icon={<PlusCircleOutlined />}
                          onClick={() => setSimulationSelectorVisible(true)}
                        >
                          New Simulation
                        </Button>
                      )
                    },
                    ...simulationsRender
                  ]
                }
              ]}
              onClick={onMenuClick}
            />
          </div>
        </Layout.Sider>
        <Layout.Content className="no-scroll relative">
          <Geometry.Add
            visible={geometryAddVisible}
            project={{
              id: project.id,
              geometries: project.geometries
            }}
            swr={{ mutateProject, addOneGeometry }}
            setVisible={(visible) => setGeometryAddVisible(visible)}
          />

          <Simulation.Selector
            user={{
              authorizedplugins: user.authorizedplugins
            }}
            visible={simulationSelectorVisible}
            onOk={async (scheme) => {
              try {
                await onSelector(project, scheme, {
                  addOneSimulation,
                  mutateProject
                })

                // Close selector
                setSimulationSelectorVisible(false)
              } catch (err) {}
            }}
            onCancel={() => setSimulationSelectorVisible(false)}
          />

          <Simulation.Updater
            user={{
              authorizedplugins: user.authorizedplugins
            }}
            simulation={
              simulation && {
                id: simulation.id,
                scheme: simulation.scheme
              }
            }
            swr={{
              mutateOneSimulation
            }}
          />

          {panel}

          <View
            project={{
              id: project.id,
              title: project.title
            }}
            simulation={
              simulation && {
                id: simulation.id
              }
            }
            geometry={
              geometry && {
                id: geometry.id,
                needCleanup: geometry.needCleanup
              }
            }
            result={
              result && {
                glb: result.glb,
                originPath: result.originPath
              }
            }
            postprocessing={
              postprocessing && {
                glb: postprocessing.glb,
                originPath: postprocessing.originPath
              }
            }
          />
          <Data
            simulation={
              simulation && {
                id: simulation.id,
                name: simulation.name
              }
            }
          />
          <Simulation.Postprocessing
            simulation={
              simulation && {
                id: simulation.id,
                scheme: simulation.scheme
              }
            }
            result={
              result && {
                name: result.name,
                fileName: result.fileName,
                originPath: result.originPath
              }
            }
            postprocessing={
              postprocessing && {
                name: postprocessing.name,
                fileName: postprocessing.fileName
              }
            }
            setResult={setPostprocessing}
          />
        </Layout.Content>
      </Layout>
    </SelectProvider>
  )
}

export default Project
