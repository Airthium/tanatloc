/** @module Components.Project */

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Layout, Menu, Typography } from 'antd'
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

import { IGeometry, ISimulation, ISimulationTaskFile } from '@/database/index.d'
import { IModel } from '@/models/index.d'

import { GoBack } from '@/components/assets/button'
import { Error as ErrorNotification } from '@/components/assets/notification'

import Loading from '@/components/loading'
import NotAuthorized from '@/components/notauthorized'

import Panel from './panel'
import Geometry from './geometry'
import View from './view'
import Data from './data'
import Simulation from './simulation'

import UserAPI from '@/api/user'
import ProjectAPI from '@/api/project'
import SimulationAPI from '@/api/simulation'
import GeometryAPI from '@/api/geometry'

/**
 * Menu keys
 * @memberof Components.Project
 */
const menuKeys = {
  dashboard: 'dashboard',
  geometries: 'geometries',
  simulations: 'simulations'
}

/**
 * Errors
 * @memberof Components.Project
 */
const errors = {
  user: 'Unable to get user',
  project: 'Unable to get project',
  simulations: 'Unable to get simulations',
  geometries: 'Unable to get geometries',
  add: 'Unable to add a simulation'
}

/**
 * Project
 * @memberof Components.Project
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
  const [geometryAdd, setGeometryAdd]: [boolean, Function] = useState(false)
  const [currentGeometry, setCurrentGeometry]: [IGeometry, Function] =
    useState()
  const [geometryVisible, setGeometryVisible]: [boolean, Function] =
    useState(false)

  const [simulationSelector, setSimulationSelector]: [boolean, Function] =
    useState(false)
  const [currentSimulation, setCurrentSimulation]: [ISimulation, Function] =
    useState()
  const [currentSimulationType, setCurrentSimulationType]: [string, Function] =
    useState()

  const [currentResult, setCurrentResult]: [ISimulationTaskFile, Function] =
    useState()

  const [panelVisible, setPanelVisible]: [boolean, Function] = useState(false)
  const [panelTitle, setPanelTitle]: [string, Function] = useState()

  // Data
  const [user, { errorUser, loadingUser }] = UserAPI.useUser()
  const [project, { mutateProject, errorProject, loadingProject }] =
    ProjectAPI.useProject(projectId || '')
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

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser])

  // Errors
  useEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser)
    if (errorProject) ErrorNotification(errors.project, errorProject)
    if (errorSimulations)
      ErrorNotification(errors.simulations, errorSimulations)
    if (errorGeometries) ErrorNotification(errors.geometries, errorGeometries)
  }, [])

  // Auto open geometry add
  useEffect(() => {
    if (!loadingProject && !loadingGeometries) {
      if (!geometries.length) setGeometryAdd(true)
      else setGeometryAdd(false)
    } else {
      setGeometryAdd(false)
    }
  }, [loadingProject, loadingGeometries, geometries])

  // Update geometry
  useEffect(() => {
    if (currentGeometry) {
      const geometry = geometries.find((g) => g.id === currentGeometry?.id)
      if (geometry) {
        if (JSON.stringify(geometry) !== JSON.stringify(currentGeometry))
          if (geometryVisible) selectGeometry(geometry.id)
          else setCurrentGeometry(geometry)
      } else {
        setCurrentGeometry()
      }
    }
  }, [currentGeometry, geometries])

  // Update simulation
  useEffect(() => {
    if (currentSimulation) {
      const simulation = simulations.find((s) => s.id === currentSimulation?.id)
      if (JSON.stringify(simulation) !== JSON.stringify(currentSimulation))
        selectSimulation(simulation?.id, currentSimulationType)
    }
  }, [currentSimulation, simulations])

  // Manage geometry
  useEffect(() => {
    if (!currentGeometry) {
      setCurrentGeometry(geometries[0])
    }
  }, [currentGeometry, geometries])

  /**
   * Handle dashboard
   */
  const handleDashboard = () => {
    router.push({
      pathname: '/dashboard',
      query: { page, workspaceId }
    })
  }

  /**
   * On menu click
   * @param data Data
   */
  const onMenuClick = ({ keyPath }: { keyPath: string[] }): void => {
    const key = keyPath.pop()
    const subKey = keyPath.pop()

    if (key === menuKeys.geometries) {
      selectGeometry(subKey)
    } else {
      // key === menuKeys.simulations
      const type = keyPath.pop().split('&').pop()
      selectSimulation(subKey, type)
    }
  }

  /**
   * Add geometry
   */
  const addGeometry = (): void => {
    setGeometryAdd(true)
  }

  /**
   * Add simulation
   */
  const addSimulation = (): void => {
    setSimulationSelector(true)
  }

  /**
   * On selector ok
   * @param {Object} scheme Simulation scheme
   */
  const onSelectorOk = async (scheme: IModel): Promise<void> => {
    try {
      // Add
      const simulation = await SimulationAPI.add(
        { id: project.id },
        { name: scheme.name, scheme }
      )

      // Mutate
      addOneSimulation(simulation)
      mutateProject({
        id: project.id,
        simulations: [...(project.simulations || []), simulation.id]
      })

      // Close selector
      setSimulationSelector(false)
    } catch (err) {
      ErrorNotification(errors.add, err)
    }
  }

  /**
   * On selector cancel
   */
  const onSelectorCancel = (): void => {
    setSimulationSelector(false)
  }

  /**
   * On panel close
   */
  const onPanelClose = (): void => {
    setPanelVisible(false)
    setPanelTitle()

    setGeometryVisible(false)

    setCurrentSimulation()
    setCurrentSimulationType()
  }

  /**
   * Select geometry
   * @param id Id
   */
  const selectGeometry = (id: string): void => {
    onPanelClose()
    setCurrentResult()

    const geometry = geometries.find((g) => g.id === id)

    setCurrentGeometry(geometry)
    setGeometryVisible(true)

    setPanelVisible(true)
    setPanelTitle(geometry.name)
  }

  /**
   * Select simulation
   * @param id Id
   * @param type Type
   */
  const selectSimulation = (id: string, type: string): void => {
    onPanelClose()

    if (currentSimulation && currentSimulation.id !== id) setCurrentResult()

    if (type === 'materials' || type === 'boundaryConditions')
      setCurrentResult()

    const simulation = simulations.find((s) => s.id === id)
    if (!simulation) return

    const configuration = simulation?.scheme?.configuration || {}
    const item = configuration[type]

    setCurrentSimulation(simulation)
    setCurrentSimulationType(type)

    setPanelVisible(true)
    setPanelTitle(item ? item.title : 'About')

    const geometryId = configuration.geometry?.value
    const geometry = geometries.find((g) => g.id === geometryId)
    if (geometry) setCurrentGeometry(geometry)
  }

  // Geometries render build
  const geometriesRender = geometries.map((g) => (
    <Menu.Item key={g.id}>{g.name}</Menu.Item>
  ))

  // Simulations render build
  const simulationsRender = simulations.map((s) => {
    const configuration = s?.scheme?.configuration || {}
    const categories = []
    Object.keys(configuration).forEach((key) => {
      const child = configuration[key]
      let icon = <CheckCircleOutlined style={{ color: 'green' }} />
      if (child.error) icon = <CloseCircleOutlined style={{ color: 'red' }} />
      if (!child.done)
        icon = <ExclamationCircleOutlined style={{ color: 'orange' }} />
      categories[child.index] = (
        <Menu.Item
          className="Project-Menu-SubMenu-Simulations-SubMenu-MenuItem"
          key={s.id + '&' + key}
          icon={icon}
        >
          {child.title}
        </Menu.Item>
      )
    })
    return (
      <Menu.SubMenu
        className="Project-Menu-SubMenu-Simulations-SubMenu"
        key={s.id}
        icon={<CodeSandboxOutlined />}
        title={s.name}
      >
        <Menu.Item
          className="Project-Menu-SubMenu-Simulations-SubMenu-MenuItem"
          key={s.id + '&about'}
          icon={<CheckCircleOutlined style={{ color: 'green' }} />}
        >
          About
        </Menu.Item>
        {categories}
      </Menu.SubMenu>
    )
  })

  /**
   * Render
   */
  if (!user || loadingUser || loadingProject) return <Loading.Simple />
  if (project.id === '0') return <NotAuthorized />
  else
    return (
      <Layout hasSider={true}>
        <Layout.Sider theme="light" className="Project-Sider" width={256}>
          <div className="logo">
            <img src="/images/logo.svg" alt="Tanatloc" />
          </div>
          <Menu mode="inline">
            <Menu.Item
              className="Project-Menu-GoBack"
              key={'menu-go-back'}
              disabled={true}
              style={{ cursor: 'unset', margin: '10px 0', paddingLeft: 10 }}
            >
              <GoBack onClick={handleDashboard}>Return to dashboard</GoBack>
            </Menu.Item>

            <Menu.Divider className="Project-Menu-Divider" />

            <Menu.Item
              className="Project-Menu-Title"
              key={'title'}
              disabled={true}
            >
              <Typography.Paragraph ellipsis={{ tooltip: true, rows: 2 }}>
                {project.title}
              </Typography.Paragraph>
            </Menu.Item>
          </Menu>
          <div className="Project-Menu-scroll">
            <Menu
              className="Project-Menu"
              mode="inline"
              defaultOpenKeys={[menuKeys.geometries, menuKeys.simulations]}
              onClick={onMenuClick}
            >
              <Menu.SubMenu
                key={menuKeys.geometries}
                className="Project-Menu-SubMenu-Geometries"
                icon={
                  loadingGeometries ? <LoadingOutlined /> : <PieChartOutlined />
                }
                title={
                  <Typography.Text strong>
                    GEOMETRIES ({geometries.length})
                  </Typography.Text>
                }
              >
                <Menu.Item
                  className="Project-Menu-SubMenu-Geometries-New"
                  key="new_geometry"
                  disabled={true}
                >
                  <Button icon={<UploadOutlined />} onClick={addGeometry}>
                    New Geometry
                  </Button>
                </Menu.Item>
                {geometriesRender}
              </Menu.SubMenu>
              <Menu.SubMenu
                key={menuKeys.simulations}
                className="Project-Menu-SubMenu-Simulations"
                icon={
                  loadingSimulations ? (
                    <LoadingOutlined />
                  ) : (
                    <CodeSandboxOutlined />
                  )
                }
                title={
                  <Typography.Text strong>
                    SIMULATIONS ({simulations.length})
                  </Typography.Text>
                }
                disabled={!geometries.length}
              >
                <Menu.Item
                  className="Project-Menu-SubMenu-Simulations-New"
                  key={'new_simulation'}
                  disabled={true}
                >
                  <Button
                    disabled={!geometries.length}
                    icon={<PlusCircleOutlined />}
                    onClick={addSimulation}
                  >
                    New Simulation
                  </Button>
                </Menu.Item>
                {simulationsRender}
              </Menu.SubMenu>
            </Menu>
          </div>
        </Layout.Sider>
        <Layout.Content className="no-scroll relative">
          <Geometry.Add
            visible={geometryAdd}
            project={{
              id: project.id,
              geometries: project.geometries
            }}
            swr={{ mutateProject, addOneGeometry }}
            setVisible={setGeometryAdd}
          />

          <Simulation.Selector
            user={user}
            visible={simulationSelector}
            onOk={onSelectorOk}
            onCancel={onSelectorCancel}
          />
          <Panel
            visible={panelVisible}
            title={panelTitle}
            onClose={onPanelClose}
          >
            {geometryVisible && currentGeometry ? (
              <Geometry
                project={{
                  id: project.id,
                  geometries: project.geometries
                }}
                geometry={{
                  id: currentGeometry.id,
                  name: currentGeometry.name,
                  summary: currentGeometry.summary
                }}
                swr={{ mutateProject, mutateOneGeometry, delOneGeometry }}
                close={onPanelClose}
              />
            ) : null}
            {currentSimulation && currentSimulationType === 'about' && (
              <Simulation.About
                project={{
                  id: project.id,
                  simulations: project.simulations
                }}
                simulation={{
                  id: currentSimulation.id,
                  name: currentSimulation.name,
                  scheme: currentSimulation.scheme
                }}
                swr={{
                  mutateProject,
                  addOneSimulation,
                  delOneSimulation,
                  mutateOneSimulation
                }}
              />
            )}
            {currentSimulation && currentSimulationType === 'geometry' && (
              <Simulation.Geometry
                geometries={geometries}
                geometry={currentGeometry}
                simulation={{
                  id: currentSimulation.id,
                  scheme: currentSimulation.scheme
                }}
                setGeometry={setCurrentGeometry}
                swr={{ mutateOneSimulation }}
              />
            )}
            {currentSimulation && currentSimulationType === 'parameters' && (
              <Simulation.Parameters
                simulation={{
                  id: currentSimulation.id,
                  scheme: currentSimulation.scheme
                }}
                swr={{ mutateOneSimulation }}
              />
            )}
            {currentSimulation && currentSimulationType === 'materials' && (
              <Simulation.Materials
                geometry={{
                  id: currentGeometry.id,
                  summary: {
                    uuid: currentGeometry.summary.uuid,
                    solids: currentGeometry.summary.solids
                  }
                }}
                simulation={{
                  id: currentSimulation.id,
                  scheme: currentSimulation.scheme
                }}
                swr={{
                  mutateOneSimulation
                }}
                setVisible={(visible) => setPanelVisible(visible)}
              />
            )}
            {currentSimulation &&
              currentSimulationType === 'initialization' && (
                <Simulation.Initialization
                  simulations={simulations}
                  simulation={currentSimulation}
                  swr={{ mutateOneSimulation }}
                />
              )}
            {currentSimulation &&
              currentSimulationType === 'boundaryConditions' && (
                <Simulation.BoundaryConditions
                  geometry={{
                    id: currentGeometry.id,
                    summary: {
                      uuid: currentGeometry.summary.uuid,
                      faces: currentGeometry.summary.faces
                    }
                  }}
                  simulation={{
                    id: currentSimulation.id,
                    scheme: currentSimulation.scheme
                  }}
                  swr={{
                    mutateOneSimulation
                  }}
                  setVisible={(visible) => setPanelVisible(visible)}
                />
              )}
            {currentSimulation && currentSimulationType === 'run' && (
              <Simulation.Run
                simulation={currentSimulation}
                result={currentResult}
                setResult={setCurrentResult}
                swr={{ mutateOneSimulation }}
              />
            )}
          </Panel>
          <Simulation.Updater
            user={{
              authorizedplugins: user.authorizedplugins
            }}
            simulation={currentSimulation}
            swr={{
              mutateOneSimulation
            }}
          />
          <View
            project={{
              id: project.id
            }}
            simulation={currentSimulation}
            geometry={currentGeometry}
            result={currentResult}
          />
          <Data
            simulation={{
              id: currentSimulation?.id,
              name: currentSimulation?.name
            }}
          />
        </Layout.Content>
      </Layout>
    )
}

export default Project
