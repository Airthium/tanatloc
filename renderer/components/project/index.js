/** @module renderer/components/project */

import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Divider, Drawer, Layout, Tooltip } from 'antd'
import {
  ArrowLeftOutlined,
  MenuOutlined,
  PlusOutlined
} from '@ant-design/icons'

import View from './view'
import Simulation from './simulation'

const Project = () => {
  // Router
  const router = useRouter()
  const { id } = router.query
  console.log('project id: ' + id)

  // State
  const [menuVisible, setMenuVisible] = useState(false)
  const [simulation, setSimulation] = useState()

  const [simulations, setSimulations] = useState([])
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
  }

  return (
    <Layout>
      <Layout className="Project-menu">
        <Tooltip title="Menu">
          <Button
            icon={<MenuOutlined />}
            onClick={() => setMenuVisible(!menuVisible)}
          />
        </Tooltip>
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
