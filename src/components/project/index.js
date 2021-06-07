/** @module components/project */

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Layout, Menu, Typography } from 'antd'
import Icon, {
  CalculatorOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import Geometries from '/public/icons/geometries'

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
 */
const menuKeys = {
  dashboard: 'dashboard',
  geometries: 'geometries',
  simulations: 'simulation'
}

/**
 * Errors
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
 */
const Project = () => {
  // Router
  const router = useRouter()
  const { workspaceId, projectId } = router.query

  // State
  const [geometryAdd, setGeometryAdd] = useState(false)
  const [currentGeometry, setCurrentGeometry] = useState()

  const [simulationSelector, setSimulationSelector] = useState(false)
  const [currentSimulation, setCurrentSimulation] = useState()
  const [currentSimulationType, setCurrentSimulationType] = useState()

  const [panelVisible, setPanelVisible] = useState(false)
  const [panelTitle, setPanelTitle] = useState()
  const [panelContent, setPanelContent] = useState()

  // Data
  const [user, { errorUser, loadingUser }] = UserAPI.useUser()
  const [
    project,
    { reloadProject, mutateProject, errorProject, loadingProject }
  ] = ProjectAPI.useProject(projectId || '')
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

  // Update geometry
  useEffect(() => {
    if (currentGeometry) {
      const geometry = geometries.find((g) => g.id === currentGeometry?.id)
      if (JSON.stringify(geometry) !== JSON.stringify(currentGeometry))
        if (panelContent?.type?.name === 'Geometry')
          selectGeometry(currentGeometry.id)
        else setCurrentGeometry(geometry)
    }
  }, [currentGeometry, JSON.stringify(geometries)])

  // Update simulation
  useEffect(() => {
    if (currentSimulation) {
      const simulation = simulations.find((s) => s.id === currentSimulation?.id)
      if (JSON.stringify(simulation) !== JSON.stringify(currentSimulation))
        selectSimulation(currentSimulation.id, currentSimulationType)
    }
  }, [currentSimulation, JSON.stringify(simulations)])

  // Manage part
  useEffect(() => {
    if (!currentGeometry) {
      setCurrentGeometry(geometries[0])
    }
  }, [currentGeometry, JSON.stringify(geometries)])

  /**
   * Handle dashboard
   */
  const handleDashboard = () => {
    router.push({
      pathname: '/dashboard',
      query: { workspaceId }
    })
  }

  /**
   * On menu click
   * @param {Object} data Data { key }
   */
  const onMenuClick = ({ keyPath }) => {
    const key = keyPath.pop()
    const subKey = keyPath.pop()

    if (key === menuKeys.geometries) {
      selectGeometry(subKey)
    } else if (key === menuKeys.simulations) {
      selectSimulation(subKey, keyPath.pop())
    }
  }

  /**
   * Add geometry
   */
  const addGeometry = () => {
    setGeometryAdd(true)
  }

  /**
   * Add simulation
   */
  const addSimulation = () => {
    setSimulationSelector(true)
  }

  /**
   * On selector ok
   * @param {Object} scheme Simulation scheme
   */
  const onSelectorOk = async (scheme) => {
    try {
      // Add in dB
      const simulation = await SimulationAPI.add(
        { id: project.id },
        { name: scheme.name, scheme }
      )

      // Mutate
      addOneSimulation(simulation)
      mutateProject({
        ...project,
        simulations: [...(project.simulations || []), simulation]
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
  const onSelectorCancel = () => {
    setSimulationSelector(false)
  }

  /**
   * On panel close
   */
  const onPanelClose = () => {
    setPanelVisible(false)
    setPanelTitle()
    setPanelContent()

    setCurrentSimulation()
    setCurrentSimulationType()
  }

  /**
   * Select geometry
   * @param {string} id Id
   */
  const selectGeometry = (id) => {
    const geometry = geometries.find((g) => g.id === id)

    setCurrentGeometry(geometry)

    setPanelVisible(true)
    setPanelTitle(geometry.name)
    setPanelContent(
      <Geometry
        project={{
          geometries: project.geometries
        }}
        geometry={{
          id: geometry.id,
          name: geometry.name,
          summary: geometry.summary
        }}
        swr={{ mutateProject, mutateOneGeometry, delOneGeometry }}
        close={() => setPanelVisible(false)}
      />
    )
  }

  /**
   * Select simulation
   * @param {string} id Id
   * @param {string} type Type
   */
  const selectSimulation = (id, type) => {
    const simulation = simulations.find((s) => s.id === id)
    const configuration = simulation.scheme.configuration
    const item = configuration[type]

    setCurrentSimulation(simulation)
    setCurrentSimulationType(type)

    setPanelVisible(true)
    setPanelTitle(item ? item.title : 'About')

    switch (type) {
      case 'about':
        setPanelContent(
          <Simulation.About
            simulation={{
              id: simulation.id,
              name: simulation.name,
              scheme: simulation.scheme
            }}
            swr={{
              reloadProject,
              delOneSimulation,
              mutateOneSimulation
            }}
          />
        )
        break
      case 'geometry':
        setPanelContent(
          <Simulation.Geometry
            geometries={geometries}
            simulation={simulation}
            swr={{ mutateOneSimulation }}
          />
        )
        break
      case 'parameters':
        setPanelContent(
          <Simulation.Parameters
            simulation={{
              id: simulation.id,
              scheme: {
                configuration: {
                  parameters: simulation.scheme.configuration.parameters
                }
              }
            }}
            swr={{ mutateOneSimulation }}
          />
        )
        break
      case 'materials':
        setPanelContent(
          <Simulation.Materials
            simulation={simulation}
            swr={{
              mutateOneSimulation
            }}
            setVisible={setPanelVisible}
          />
        )
        break
      case 'boundaryConditions':
        setPanelContent(
          <Simulation.BoundaryConditions
            simulation={simulation}
            swr={{
              mutateOneSimulation
            }}
            setVisible={setPanelVisible}
          />
        )
        break
      case 'run':
        setPanelContent(
          <Simulation.Run
            simulation={simulation}
            swr={{ mutateOneSimulation }}
          />
        )
        break
      default:
        break
    }
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
      if (key === 'part') return
      const child = configuration[key]
      categories[child.index] = (
        <Menu.Item
          className="menu-item-with-line"
          key={key}
          icon={
            child.error ? (
              <CloseCircleOutlined style={{ color: 'red' }} />
            ) : child.done ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <ExclamationCircleOutlined style={{ color: 'orange' }} />
            )
          }
        >
          {child.title}
        </Menu.Item>
      )
    })
    return (
      <Menu.SubMenu key={s.id} title={s.name}>
        <Menu.Item
          className="menu-item-with-line"
          key={'about'}
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
  if (loadingUser || loadingProject || loadingGeometries || loadingSimulations)
    return <Loading.Simple />
  if (project === 'Unauthorized') return <NotAuthorized />
  else
    return (
      <Layout hasSider={true}>
        <Layout.Sider theme="light" className="Project-sider" width={256}>
          <div className="logo">
            <img src="/images/logo.svg" />
          </div>

          <Menu mode="inline" onClick={onMenuClick}>
            <Menu.Item
              key={'go-back'}
              disabled={true}
              style={{ cursor: 'unset' }}
            >
              <GoBack onClick={handleDashboard}>Return to dashboard</GoBack>
            </Menu.Item>

            <Menu.Item
              key={'title'}
              disabled={true}
              style={{ cursor: 'unset' }}
            >
              <Typography.Title className="Project-title" level={4}>
                {project.title}
              </Typography.Title>
            </Menu.Item>

            <Menu.Divider
              style={{ backgroundColor: '#fad114', margin: '0 20px' }}
            />

            <Menu.SubMenu
              key={menuKeys.geometries}
              icon={
                <Icon component={Geometries} style={{ maxWidth: '14px' }} />
              }
              title={'Geometries (' + geometries.length + ')'}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              {geometriesRender}
              <Menu.Item
                key="new_geometry"
                disabled={true}
                style={{ cursor: 'unset' }}
              >
                <Button icon={<PlusOutlined />} onClick={addGeometry}>
                  New geometry
                </Button>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu
              key={menuKeys.simulations}
              icon={<CalculatorOutlined />}
              title={'Simulations (' + simulations.length + ')'}
              style={{ backgroundColor: '#f0f0f0' }}
            >
              {simulationsRender}
              <Menu.Item
                key={'new_simulation'}
                disabled={true}
                style={{ cursor: 'unset' }}
              >
                <Button icon={<PlusOutlined />} onClick={addSimulation}>
                  New simulation
                </Button>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
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
            {panelContent}
          </Panel>
          <Simulation
            user={user}
            geometries={geometries}
            simulation={currentSimulation}
            swr={{
              reloadProject,
              addOneSimulation,
              delOneSimulation,
              mutateOneSimulation
            }}
          />
          <View
            project={{
              id: project.id
            }}
            geometry={currentGeometry}
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
