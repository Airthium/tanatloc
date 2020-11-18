/** @module renderer/components/project/simulation */

import { useState, useEffect } from 'react'
import { Layout, Menu, Modal } from 'antd'

import Panel from '../panel'

import About from './about'
import Geometry from './geometry'
import Parameters from './parameters'
import BoundaryConditions from './boundaryConditions'

import models from '../../../../models'

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
    const model = models.find((m) => m.algorithm === key)
    setCurrent(model)
  }

  /**
   * On create
   */
  const onCreate = async () => {
    setLoading(true)
    if (current) onOk(current)
    setLoading(false)
  }

  /**
   * MatJax
   */
  useEffect(() => {
    window.MathJax?.typeset()
  }, [current])

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
          <Menu mode="inline" onSelect={onSelect}>
            {models.map((model) => {
              return <Menu.Item key={model.algorithm}>{model.name}</Menu.Item>
            })}
          </Menu>
        </Layout.Sider>
        <Layout.Content>
          <div dangerouslySetInnerHTML={{ __html: current?.description }} />
        </Layout.Content>
      </Layout>
    </Modal>
  )
}

/**
 * Simulation
 * @param {Object} props Props
 */
const Simulation = ({ project, simulation, type, part, onClose }) => {
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
      {type === 'geometry' && (
        <Geometry project={project} simulation={simulation} part={part} />
      )}
      {type === 'parameters' && (
        <Parameters project={project} simulation={simulation} />
      )}
      {type === 'boundaryConditions' && (
        <BoundaryConditions
          project={project}
          simulation={simulation}
          part={part}
          setVisible={setVisible}
        />
      )}
    </Panel>
  )
}

Simulation.Selector = Selector

export default Simulation
