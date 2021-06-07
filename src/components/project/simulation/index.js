/** @module components/project/simulation */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Layout, Menu, Modal, Space, Typography } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { addedDiff, updatedDiff } from 'deep-object-diff'
import merge from 'lodash.merge'

import { Error } from '@/components/assets/notification'

import Panel from '../panel'

import About from './about'
import Geometry from './geometry'
import Materials from './materials'
import Parameters from './parameters'
import BoundaryConditions from './boundaryConditions'
import Run from './run'

import SimulationAPI from '@/api/simulation'

import Models from '@/models'
import Plugins from '@/plugins'

/**
 * Errors
 */
const errors = {
  updateError: 'Unable to update the simulation'
}

/**
 * Load models
 * @param {Object} user User
 * @param {Object} models Models
 * @param {Object} plugins Plugins
 */
const loadModels = (user, models, plugins) => {
  let allModels = models

  Object.keys(plugins).forEach((key) => {
    if (
      user?.authorizedplugins?.includes(key) &&
      plugins[key].category === 'Model'
    )
      allModels = [...allModels, ...plugins[key].models]
  })

  return allModels
}

/**
 * Simulation Selector
 * @param {Object} props Props
 */
const Selector = ({ user, visible, onOk, onCancel }) => {
  // State
  const [current, setCurrent] = useState()
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState([])

  // MatJax
  useEffect(() => {
    window.MathJax?.typeset()
  }, [current])

  // Models
  useEffect(() => {
    const allModels = loadModels(user, Models, Plugins)
    setModels(allModels)
  }, [Models, Plugins, user])

  /**
   * On select
   * @param {Object} data Data { key }
   */
  const onSelect = ({ key }) => {
    const model = models.find((m) => m.algorithm === key)
    setCurrent({ ...model })
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

Selector.propTypes = {
  user: PropTypes.shape({
    authorizedplugins: PropTypes.array
  }).isRequired,
  visible: PropTypes.bool,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

/**
 * Simulation
 * @param {Object} props Props
 */
const Simulation = ({
  user,
  geometries,
  simulation,
  type,
  part,
  swr,
  onClose,
  setPanelVisible,
  setPanelTitle,
  setPanelContent
}) => {
  // State
  const [needUpdate, setNeedUpdate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState([])

  // Models
  useEffect(() => {
    const allModels = loadModels(user, Models, Plugins)
    setModels(allModels)
  }, [Models, Plugins, user])

  // Check model update
  useEffect(() => {
    const currentModel = models.find(
      (m) => m.algorithm === simulation?.scheme?.algorithm
    )

    if (currentModel && simulation?.scheme) {
      const added = addedDiff(simulation.scheme, currentModel)
      const updated = updatedDiff(simulation.scheme, currentModel)

      if (Object.keys(added).length || Object.keys(updated).length)
        setNeedUpdate(true)
      else setNeedUpdate(false)
    }
  }, [simulation, JSON.stringify(models)])

  /**
   * Simulation effect
   */
  useEffect(() => {
    setPanelVisible(!!simulation)
    const configuration = simulation?.scheme?.configuration

    const subScheme = configuration?.[type]
    setPanelTitle(subScheme ? subScheme.title : 'About')
  }, [simulation, type])

  /**
   * On update
   */
  const onUpdate = async () => {
    setLoading(true)

    try {
      // Current model
      const currentModel = models.find(
        (m) => m.algorithm === simulation?.scheme?.algorithm
      )

      // New simulation
      const newSimulation = { ...simulation }

      // Merge
      merge(newSimulation.scheme, currentModel)

      // Update simulation
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          value: newSimulation.scheme
        }
      ])

      // Mutate
      swr.mutateOneSimulation(newSimulation)
    } catch (err) {
      Error(errors.updateError, err)
    }

    setLoading(false)
    setNeedUpdate(false)
  }

  switch (type) {
    case 'about':
      setPanelContent(
        <About
          simulation={{
            id: simulation?.id,
            name: simulation?.name,
            scheme: simulation?.scheme
          }}
          swr={{
            reloadProject: swr.reloadProject,
            delOneSimulation: swr.delOneSimulation,
            mutateOneSimulation: swr.mutateOneSimulation
          }}
        />
      )
      break
    case 'geometry':
      setPanelContent(
        <Geometry
          geometries={geometries}
          simulation={simulation}
          part={part}
          swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
        />
      )
      break
    case 'parameters':
      setPanelContent(
        <Parameters
          simulation={simulation}
          swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
        />
      )
      break
    case 'materials':
      setPanelContent(
        <Materials
          simulation={simulation}
          part={part}
          swr={{
            mutateOneSimulation: swr.mutateOneSimulation
          }}
          setVisible={setVisible}
        />
      )
      break
    case 'boundaryConditions':
      setPanelContent(
        <BoundaryConditions
          simulation={simulation}
          part={part}
          swr={{
            mutateOneSimulation: swr.mutateOneSimulation
          }}
          setVisible={setVisible}
        />
      )
      break
    case 'run':
      setPanelContent(
        <Run
          simulation={simulation}
          swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
        />
      )
      break
    default:
      break
  }

  /**
   * Render
   */
  if (!simulation) return null
  else
    return (
      <Modal
        title={
          <>
            <WarningOutlined style={{ color: 'orange', marginRight: '5px' }} />
            Update
          </>
        }
        visible={needUpdate}
        onOk={onUpdate}
        okText="Yes"
        confirmLoading={loading}
        onCancel={() => setNeedUpdate(false)}
        cancelText="No"
        maskClosable={false}
      >
        <Space direction="vertical">
          <Typography.Text>Your model needs an update!</Typography.Text>
          <Typography.Text strong>Update now?</Typography.Text>
        </Space>
      </Modal>
    )
}

Simulation.propTypes = {
  user: PropTypes.shape({
    authorizedplugins: PropTypes.array
  }).isRequired,
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  type: PropTypes.string,
  part: PropTypes.object,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

Simulation.Selector = Selector

Simulation.About = About
Simulation.Geometry = Geometry
Simulation.Materials = Materials
Simulation.Parameters = Parameters
Simulation.BoundaryConditions = BoundaryConditions
Simulation.Run = Run

export default Simulation
