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
import Simulation from './simulation'

import { useUser } from '../../../src/api/user'
import { useProject, update } from '../../../src/api/project'
import { add } from '../../../src/api/simulation'

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
  const { id } = router.query

  // State
  const [selectorVisible, setSelectorVisible] = useState(false)
  const [simulations, setSimulations] = useState([])
  const [simulation, setSimulation] = useState()

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
    router.push('/dashboard')
  }

  // const onTitleClick = ({ key }) => {
  //   console.log('menuClick')
  //   console.log(key)
  // }

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
    // Add in dB
    const simulationData = await add({ name: scheme.title, scheme })

    // State
    simulations.push({
      scheme: scheme,
      render: (
        <Menu.SubMenu
          key={menuKeys.simulation + simulationData.id}
          icon={<CalculatorOutlined />}
          title={scheme.title}
          // onTitleClick={onTitleClick}
        >
          {scheme.children.map((child) => {
            return (
              <Menu.Item
                key={
                  menuKeys.simulation +
                  '-' +
                  simulationData.id +
                  '-' +
                  child.key
                }
              >
                {child.title}
              </Menu.Item>
            )
          })}
        </Menu.SubMenu>
      )
    })
    setSimulations(simulations)
    setSelectorVisible(false)
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
    const descriptor = key.split('-')
    const index = descriptor[1]
    const type = descriptor[2]

    const scheme = simulations[index].scheme
    const subScheme = scheme.children.find((s) => s.key === type)

    setSimulation({
      type: type,
      scheme: subScheme
    })
  }

  /**
   * On simulation close
   */
  const onSimulationClose = () => {
    setSimulation()
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
          {simulations.map((simu) => simu.render)}
        </Menu>
      </Layout.Sider>
      <Layout.Content className="no-scroll relative">
        <Simulation.Selector
          visible={selectorVisible}
          onOk={onSelectorOk}
          onCancel={onSelectorCancel}
        />
        <Simulation simulation={simulation} onClose={onSimulationClose} />
        <View />
      </Layout.Content>
    </Layout>
  )
}

export default Project
