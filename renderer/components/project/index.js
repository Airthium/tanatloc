/** @module renderer/components/project */

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { message, Layout, Menu, Typography } from 'antd'
import {
  ArrowLeftOutlined,
  CalculatorOutlined,
  PlusOutlined
} from '@ant-design/icons'

import View from './view'
// import Simulation from './simulation'

import { useUser } from '../../../src/api/user'
import { useProject, update } from '../../../src/api/project'

import Sentry from '../../../src/lib/sentry'

const menuKeys = {
  dashboard: 'dashboard',
  newSimulation: 'new-simulation',
  simulation: 'simulation'
}

const simulationScheme = {
  title: 'A simulation',
  children: [
    {
      title: 'Geometry',
      key: 'geometry'
    },
    {
      title: 'Parameters',
      key: 'parameters'
    },
    {
      title: 'Run',
      key: 'run'
    },
    {
      title: 'Results',
      key: 'results'
    }
  ]
}

/**
 * Project
 */
const Project = () => {
  // Router
  const router = useRouter()
  const { id } = router.query

  // State
  const [simulation, setSimulation] = useState()
  const [simulations, setSimulations] = useState([])

  // Data
  const [user, { loadingUser }] = useUser()
  const [project, { mutateProject }] = useProject(id || '')

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser])

  /**
   * Handle title
   * @param {srting} title Title
   */
  const handleTitle = async (title) => {
    try {
      // Update
      await update({ id }, [{ key: 'title', value: title }])

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

  const onMenuClick = ({ key }) => {
    console.log(key)
    if (key === menuKeys.dashboard) handleDashboard()
    if (key === menuKeys.newSimulation) addSimulation()
  }

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  const onTitleClick = ({ key }) => {
    console.log(key)
  }

  /**
   * Add simulation
   */
  const addSimulation = () => {
    const simulationId = simulations.length
    simulations.push(
      <Menu.SubMenu
        key={menuKeys.simulation + simulationId}
        icon={<CalculatorOutlined />}
        title={simulationScheme.title}
        onTitleClick={onTitleClick}
      >
        {simulationScheme.children.map((child) => {
          return (
            <Menu.Item
              key={menuKeys.simulation + '-' + simulationId + '-' + child.key}
            >
              {child.title}
            </Menu.Item>
          )
        })}
      </Menu.SubMenu>
    )
    setSimulations(simulations)
    setSimulation({ id: simulationId })
  }

  /**
   * Render
   */
  return (
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
          {simulations}
        </Menu>
      </Layout.Sider>
      <Layout.Content className="no-scroll">
        {/* <Simulation simulation={simulation} /> */}
        <View />
      </Layout.Content>
    </Layout>
  )
}

export default Project
