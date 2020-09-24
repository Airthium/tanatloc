/** @module renderer/components/project */

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  message,
  Button,
  Divider,
  Drawer,
  Layout,
  Tooltip,
  Typography
} from 'antd'
import {
  ArrowLeftOutlined,
  MenuOutlined,
  PlusOutlined
} from '@ant-design/icons'

import View from './view'
import Simulation from './simulation'

import { useUser } from '../../../src/api/user'
import { useProject, update } from '../../../src/api/project'

import Sentry from '../../../src/lib/sentry'

/**
 * Project
 */
const Project = () => {
  // Router
  const router = useRouter()
  const { id } = router.query

  // State
  const [menuVisible, setMenuVisible] = useState(false)
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

  /**
   * Add simulation
   */
  const addSimulation = () => {
    const simulationId = simulations.length

    simulations.push(
      <Button
        key={simulationId}
        onClick={() => setSimulation({ id: simulationId })}
      >
        {simulationId}
      </Button>
    )
    setSimulations(simulations)
    setSimulation({ id: simulationId })
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout className="Project-menu">
        <Tooltip title="Menu">
          <Button
            icon={<MenuOutlined />}
            onClick={() => setMenuVisible(!menuVisible)}
          />
        </Tooltip>
        <Typography.Title
          className="Project-title"
          level={2}
          editable={{
            onChange: handleTitle,
            maxLength: 50
          }}
        >
          {project.title}
        </Typography.Title>
        <Drawer
          className="Project-menu-drawer"
          title="Menu"
          visible={menuVisible}
          onClose={() => setMenuVisible(!menuVisible)}
          mask={false}
          maskClosable={false}
          placement="left"
          getContainer={false}
          bodyStyle={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px'
          }}
          width="100%"
        >
          <div className="drawer-group">
            <Tooltip title="Dashboard">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/dashboard')}
              />
            </Tooltip>
          </div>
          <Divider />
          <div className="drawer-group">
            <Tooltip title="New simulation">
              <Button icon={<PlusOutlined />} onClick={addSimulation} />
            </Tooltip>
            <div className="drawer-subgroup">{simulations}</div>
          </div>
        </Drawer>
      </Layout>
      <Simulation simulation={simulation} />
      <View />
    </Layout>
  )
}

export default Project
