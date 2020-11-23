/** @module renderer/components/project */

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { message, Layout, Menu, Typography } from 'antd'
import {
  ArrowLeftOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'

import NotAuthorized from '../notauthorized'
import View from './view'
import Simulation from './simulation'

import { useUser } from '../../../src/api/user'
import { useProject, update } from '../../../src/api/project'
import { add, useSimulations } from '../../../src/api/simulation'

import Sentry from '../../../src/lib/sentry'

const menuKeys = {
  dashboard: 'dashboard',
  newSimulation: 'new-simulation',
  simulation: 'simulation'
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
  const [user, { loadingUser }] = useUser()
  const [project, { mutateProject }] = useProject(projectId || '')
  const [simulations, { addOneSimulation }] = useSimulations(
    project.simulations
  )

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

  /**
   * Handle title
   * @param {srting} title Title
   */
  const handleTitle = async (title) => {
    try {
      // Update
      await update({ id: project.id }, [{ key: 'title', value: title }])

      // Mutate
      mutateProject({
        ...project,
        title
      })
    } catch (err) {
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)
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
      const simulation = await add(
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
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)
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
      const child = configuration[key]
      if (!child.subMenus?.length) {
        categories[child.index] = (
          <Menu.Item
            key={menuKeys.simulation + '&' + s.id + '&' + key}
            icon={
              child.done ? (
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
        <View simulation={currentSimulation} setPartSummary={setPartSummary} />
      </Layout.Content>
    </Layout>
  )
}

export default Project
