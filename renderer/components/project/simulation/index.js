/** @module renderer/components/project/simulation */

import { useState, useEffect } from 'react'
import { Layout, Menu, Modal } from 'antd'

import Panel from '../panel'

import Geometry from './geometry'
import About from './about'

// TODO test data only
const simulationScheme = {
  algorithm: 'Laplacian',
  category: 'academic',
  categories: {
    geometry: {
      index: 1,
      title: 'Geometry'
    },
    parameters: {
      index: 2,
      title: 'Parameters'
    },
    run: {
      index: 3,
      title: 'Run'
    },
    results: {
      index: 4,
      title: 'Results'
    }
  }
}

/**
 * Simulation Selector
 * @param {Object} props Props
 */
const Selector = ({ visible, onOk, onCancel }) => {
  // State
  const [current, setCurrent] = useState()
  const [loading, setLoading] = useState(false)

  /**
   * On select
   * @param {Object} data Data { key }
   */
  const onSelect = ({ key }) => {
    setCurrent(key)
  }

  /**
   * On create
   */
  const onCreate = async () => {
    setLoading(true)
    if (current) onOk(simulationScheme)
    setLoading(false)
  }

  /**
   * Render
   */
  return (
    <Modal
      visible={visible}
      title="Create simulation"
      okText="Create"
      okButtonProps={{ loading: loading }}
      onOk={onCreate}
      onCancel={onCancel}
    >
      <Layout>
        <Layout.Sider theme="light">
          <Menu mode="inline" openKeys={['academic']} onSelect={onSelect}>
            <Menu.SubMenu key="academic" title="Academic" disabled={true}>
              <Menu.Item key="laplacian">Laplacian</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Layout.Sider>
        <Layout.Content>{current}</Layout.Content>
      </Layout>
    </Modal>
  )
}

/**
 * Simulation
 * @param {Object} props Props
 */
const Simulation = ({ project, simulation, type, onClose }) => {
  // State
  const [visible, setVisible] = useState()
  const [title, setTitle] = useState()

  /**
   * Simulation effect
   */
  useEffect(() => {
    setVisible(simulation)
    const subScheme = simulation?.scheme.categories[type]
    setTitle(subScheme ? subScheme.title : 'About')
  }, [simulation, type])

  /**
   * Render
   */
  return (
    <Panel visible={visible} title={title} onClose={onClose}>
      {type === 'about' && <About project={project} simulation={simulation} />}
      {type === 'geometry' && <Geometry simulation={simulation} />}
    </Panel>
  )
}

Simulation.Selector = Selector

export default Simulation
