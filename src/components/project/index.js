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
import { Error } from '@/components/assets/notification'

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
  newSimulation: 'new-simulation',
  simulation: 'simulation'
}

/**
 * Errors
 */
const errors = {
  updateError: 'Unable to update the project',
  addError: 'Unable to add a simulation'
}

/**
 * Project
 */
const Project = () => {
  // Router
  const router = useRouter()
  const { workspaceId, projectId } = router.query

  // State
  const [selectorVisible, setSelectorVisible] = useState(false)
  const [addGeometry, setAddGeometry] = useState(false)
  const [currentGeometry, setCurrentGeometry] = useState()
  const [currentSimulation, setCurrentSimulation] = useState()
  const [currentType, setCurrentType] = useState()
  const [partSummary, setPartSummary] = useState()

  // Data
  const [user, { loadingUser }] = UserAPI.useUser()
  const [project, { reloadProject, mutateProject, loadingProject }] =
    ProjectAPI.useProject(projectId || '')
  const [
    simulations,
    {
      addOneSimulation,
      delOneSimulation,
      mutateOneSimulation,
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

  // Update simulation
  useEffect(() => {
    if (currentSimulation) {
      const simulation = simulations.find((s) => s.id === currentSimulation?.id)
      if (JSON.stringify(simulation) !== JSON.stringify(currentSimulation))
        setCurrentSimulation(simulation)
    }
  }, [currentSimulation, JSON.stringify(simulations)])

  // Manage part
  useEffect(() => {
    const configuration = currentSimulation?.scheme?.configuration

    if (configuration?.geometry?.file) {
      if (
        !configuration.part ||
        ((currentType === 'materials' ||
          currentType === 'boundaryConditions') &&
          configuration?.part?.type !== 'geometry')
      ) {
        // Force geometry
        const newSimulation = { ...currentSimulation }

        // Update local
        newSimulation.scheme.configuration.part = configuration.geometry.file

        // Update simulation
        SimulationAPI.update({ id: currentSimulation.id }, [
          {
            key: 'scheme',
            type: 'json',
            method: 'set',
            path: ['configuration', 'part'],
            value: configuration.geometry.file
          }
        ])
          .then(() => {
            // Mutate
            mutateOneSimulation(newSimulation)

            // State
            setCurrentSimulation(newSimulation)
          })
          .catch((err) => {
            Error(errors.updateError, err)
          })
      }
    } else {
      // Check for removed geometry
      if (configuration?.part?.type === 'geometry') {
        // Remove part
        SimulationAPI.update({ id: currentSimulation.id }, [
          {
            key: 'scheme',
            type: 'json',
            method: 'erase',
            path: ['configuration', 'part']
          }
        ])
          .then(() => {
            // Update local
            const newSimulation = { ...currentSimulation }
            newSimulation.scheme.configuration.part = { needCleanup: true }

            // Mutate
            mutateOneSimulation(newSimulation)

            // State
            setCurrentSimulation(newSimulation)
          })
          .catch((err) => {
            Error(errors.updateError, err)
          })
      }
    }
  }, [currentSimulation, currentType])

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
   * Add simulation
   */
  const addSimulation = () => {
    setSelectorVisible(true)
  }

  /**
   * On menu click
   * @param {Object} data Data { key }
   */
  const onMenuClick = ({ keyPath }) => {
    const key = keyPath.pop()
    const subKey = keyPath.pop()

    if (key === menuKeys.geometries) {
      if (subKey === 'add') setAddGeometry(true)
      else selectGeometry(subKey)
    } else if (key.includes(menuKeys.simulation)) {
      const id = key.split('&').pop()
      selectSimulation(id, subKey)
    }
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
      setSelectorVisible(false)
    } catch (err) {
      Error(errors.addError, err)
    }
  }

  /**
   * On selector cancel
   */
  const onSelectorCancel = () => {
    setSelectorVisible(false)
  }

  /**
   * Select geometry
   * @param {string} id Id
   */
  const selectGeometry = (id) => {
    const geometry = geometries.find((g) => g.id === id)

    setCurrentGeometry(geometry)
  }

  /**
   * Select simulation
   * @param {string} id Id
   * @param {string} type Type
   */
  const selectSimulation = (id, type) => {
    setCurrentType()

    const simulation = simulations.find((s) => s.id === id)

    setCurrentSimulation(simulation)
    setCurrentType(type)
  }

  /**
   * On simulation close
   */
  const onSimulationClose = () => {
    setCurrentSimulation()
    setCurrentType()
  }

  // Geometries render build
  const geometriesRender = geometries.map((g) => (
    <Menu.Item key={g.id}>{g.name}</Menu.Item>
  ))

  // Simulations render build
  const simulationsRender = simulations.map((s) => {
    const categories = []
    const configuration = s?.scheme?.configuration || {}
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
      <Menu.SubMenu
        key={'simulation&' + s.id}
        icon={<CalculatorOutlined />}
        title={s.name}
      >
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
              title="Geometries"
            >
              {geometriesRender}
              <Menu.Item key="add" icon={<PlusOutlined />} />
            </Menu.SubMenu>

            <Menu.Item
              key={'new_simulation'}
              disabled={true}
              style={{ cursor: 'unset' }}
            >
              <Button icon={<PlusOutlined />} onClick={addSimulation}>
                New simulation
              </Button>
            </Menu.Item>
            {simulationsRender}
          </Menu>
        </Layout.Sider>
        <Layout.Content className="no-scroll relative">
          <Simulation.Selector
            user={user}
            visible={selectorVisible}
            onOk={onSelectorOk}
            onCancel={onSelectorCancel}
          />
          <Geometry.Add
            visible={addGeometry}
            project={{
              id: project.id
            }}
            swr={{ addOneGeometry }}
            setVisible={setAddGeometry}
          />
          {currentGeometry && (
            <Panel
              visible={true}
              title="Geometry"
              onClose={() => setCurrentGeometry()}
            >
              <Geometry
                geometry={{
                  id: currentGeometry.id,
                  name: currentGeometry.name,
                  summary: currentGeometry.summary
                }}
                swr={{ mutateOneGeometry, delOneGeometry }}
              />
            </Panel>
          )}
          <Simulation
            user={user}
            simulation={currentSimulation}
            type={currentType}
            part={partSummary}
            swr={{
              reloadProject,
              addOneSimulation,
              delOneSimulation,
              mutateOneSimulation
            }}
            onClose={onSimulationClose}
          />
          <View
            project={{
              id: project.id
            }}
            simulation={{
              id: currentSimulation?.id,
              part: currentSimulation?.scheme?.configuration?.part
            }}
            setPartSummary={setPartSummary}
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
