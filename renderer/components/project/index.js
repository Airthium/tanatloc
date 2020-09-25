/** @module renderer/components/project */

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  message,
  Breadcrumb,
  Button,
  Divider,
  Layout,
  Tooltip,
  Typography
} from 'antd'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'

import View from './view'
// import Simulation from './simulation'

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
      <Layout.Sider
        theme="light"
        style={{ borderRight: '1px solid black', padding: '5px' }}
      >
        <Breadcrumb>
          <Breadcrumb.Item
            onClick={() => router.push('/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item>Project</Breadcrumb.Item>
        </Breadcrumb>

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

        <Divider />

        <div className="group">
          <Tooltip title="New simulation">
            <Button icon={<PlusOutlined />} onClick={addSimulation} />
          </Tooltip>
          <div className="subgroup">{simulations}</div>
        </div>
      </Layout.Sider>
      <Layout.Content>
        {/* <Simulation simulation={simulation} /> */}
        <View />
      </Layout.Content>
    </Layout>
  )
}

export default Project
