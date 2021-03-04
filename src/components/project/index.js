/** @module 'src/components/project */

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Layout, Menu, Typography } from 'antd'
import {
  ArrowLeftOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'

import { Error } from '@/components/assets/notification'

import NotAuthorized from '@/components/notauthorized'

import View from './view'
import Data from './data'
import Simulation from './simulation'

import UserAPI from '@/api/user'
import ProjectAPI from '@/api/project'
import SimulationAPI from '@/api/simulation'

/**
 * Menu keys
 */
const menuKeys = {
  dashboard: 'dashboard',
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
  const [currentSimulation, setCurrentSimulation] = useState()
  const [currentType, setCurrentType] = useState()
  const [partSummary, setPartSummary] = useState()

  // Data
  const [user, { loadingUser }] = UserAPI.useUser()
  const [project, { mutateProject }] = ProjectAPI.useProject(projectId || '')
  const [
    simulations,
    { addOneSimulation, mutateOneSimulation }
  ] = SimulationAPI.useSimulations(project?.simulations)

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser])

  // Modified simulation
  useEffect(() => {
    const simulation = simulations.find((s) => s.id === currentSimulation?.id)
    if (JSON.stringify(simulation) !== JSON.stringify(currentSimulation))
      setCurrentSimulation(simulation)
  }, [simulations])

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
   * Handle title
   * @param {srting} title Title
   */
  const handleTitle = async (title) => {
    try {
      // Update
      await ProjectAPI.update({ id: project.id }, [
        { key: 'title', value: title }
      ])

      // Mutate
      mutateProject({
        ...project,
        title
      })
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * On menu click
   * @param {Object} data Data { key }
   */
  const onMenuClick = ({ key }) => {
    if (key === menuKeys.dashboard) handleDashboard()
    else if (key === menuKeys.newSimulation) addSimulation()
    else if (key.includes(menuKeys.simulation)) selectSimulation(key)
  }

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
   * On selector ok
   * @param {Object} scheme Simulation scheme
   */
  const onSelectorOk = async (scheme) => {
    try {
      // Add in dB
      const simulation = await SimulationAPI.add(
        { id: project.id },
        { name: scheme.algorithm, scheme }
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
   * On simulation select
   * @param {string} key Key
   */
  const selectSimulation = (key) => {
    setCurrentType()

    const descriptor = key.split('&')
    const simulationId = descriptor[1]
    const type = descriptor[2]

    const simulation = simulations.find((s) => s.id === simulationId)

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

  // Simulations render build
  const simulationsRender = simulations.map((s) => {
    const categories = []
    const configuration = s?.scheme?.configuration || {}
    Object.keys(configuration).forEach((key) => {
      if (key === 'part') return
      const child = configuration[key]
      if (!child.subMenus?.length) {
        categories[child.index] = (
          <Menu.Item
            key={menuKeys.simulation + '&' + s.id + '&' + key}
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
      } else {
        const subMenus = child.subMenus.map((subMenu, index) => {
          return (
            <Menu.Item
              key={menuKeys.simulation + '&' + s.id + '&' + key + '&' + index}
            >
              {subMenu.title}
            </Menu.Item>
          )
        })
        categories[child.index] = (
          <Menu.SubMenu
            key={menuKeys.simulation + '&' + s.id + '&' + key}
            icon={
              child.done ? (
                <CheckCircleOutlined style={{ color: 'green' }} />
              ) : (
                <ExclamationCircleOutlined style={{ color: 'orange' }} />
              )
            }
            title={child.title}
            onTitleClick={onMenuClick}
          >
            {subMenus}
          </Menu.SubMenu>
        )
      }
    })
    return (
      <Menu.SubMenu
        key={menuKeys.simulation + s.id}
        icon={<CalculatorOutlined />}
        title={s.name}
      >
        <Menu.Item
          key={menuKeys.simulation + '&' + s.id + '&about'}
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
  return project === 'Unauthorized' ? (
    <NotAuthorized />
  ) : (
    <Layout hasSider={true}>
      <Layout.Sider theme="light" className="Project-sider">
        <Menu onClick={onMenuClick}>
          <Menu.Item key={menuKeys.dashboard} icon={<ArrowLeftOutlined />}>
            Dashboard
          </Menu.Item>
        </Menu>
        <Typography.Title
          className="Project-title"
          level={4}
          editable={{
            onChange: handleTitle,
            maxLength: 50
          }}
        >
          {project.title}
        </Typography.Title>

        <Menu mode="inline" onClick={onMenuClick}>
          <Menu.Item key={menuKeys.newSimulation} icon={<PlusOutlined />}>
            New simulation
          </Menu.Item>
          {simulationsRender}
        </Menu>
      </Layout.Sider>
      <Layout.Content className="no-scroll relative">
        <Simulation.Selector
          visible={selectorVisible}
          onOk={onSelectorOk}
          onCancel={onSelectorCancel}
        />
        <Simulation
          project={{ id: project.id, simulations: project.simulations }}
          simulation={currentSimulation}
          type={currentType}
          part={partSummary}
          onClose={onSimulationClose}
        />
        <View
          simulation={{
            id: currentSimulation?.id,
            part: currentSimulation?.scheme?.configuration?.part
          }}
          setPartSummary={setPartSummary}
        />
        <Data simulation={{ id: currentSimulation?.id }} />
      </Layout.Content>
    </Layout>
  )
}

export default Project
