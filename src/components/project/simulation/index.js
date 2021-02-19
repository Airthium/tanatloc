/** @module 'src/components/project/simulation */

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
 * Simulation Selector
 * @param {Object} props Props
 */
const Selector = ({ visible, onOk, onCancel }) => {
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
    let allModels = Models

    Object.keys(Plugins).forEach((key) => {
      if (Plugins[key].category === 'Model')
        allModels = [...allModels, ...Plugins[key].models]
    })
    setModels(allModels)
  }, [Models, Plugins])

  /**
   * On select
   * @param {Object} data Data { key }
   */
  const onSelect = ({ key }) => {
    const model = models.find((m) => m.algorithm === key)
    setCurrent({ ...model })
    // TODO review that
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

/**
 * Simulation
 * @param {Object} props Props
 */
const Simulation = ({ project, simulation, type, part, onClose }) => {
  // State
  const [needUpdate, setNeedUpdate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState()
  const [models, setModels] = useState([])

  // Data
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )

  // Models
  useEffect(() => {
    let allModels = Models

    Object.keys(Plugins).forEach((key) => {
      if (Plugins[key].category === 'Model')
        allModels = [...allModels, ...Plugins[key].models]
    })
    setModels(allModels)
  }, [Models, Plugins])

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
  }, [simulation, models])

  /**
   * Simulation effect
   */
  useEffect(() => {
    setVisible(simulation)
    const configuration = simulation?.scheme?.configuration

    if (configuration?.geometry?.file) {
      if (
        !configuration?.part ||
        ((type === 'materials' || type === 'boundaryConditions') &&
          part?.type !== 'geometry')
      ) {
        // Force geometry
        const newSimulation = { ...simulation }

        // Update local
        newSimulation.scheme.configuration.part = configuration.geometry.file

        // Update simulation
        SimulationAPI.update({ id: simulation.id }, [
          {
            key: 'scheme',
            type: 'json',
            method: 'diff',
            path: ['configuration', 'part'],
            value: configuration.geometry.file
          }
        ])
          .then(() => {
            // Mutate
            mutateOneSimulation(newSimulation)
          })
          .catch((err) => {
            Error(errors.updateError, err)
          })
      }
    } else {
      // Check for removed geometry
      if (configuration?.part && part?.type == 'geometry') {
        // Remove part
        SimulationAPI.update({ id: simulation.id }, [
          {
            key: 'scheme',
            type: 'json',
            method: 'erase',
            path: ['configuration', 'part']
          }
        ])
          .then(() => {
            // Update local
            const newSimulation = { ...simulation }
            newSimulation.scheme.configuration.part = null

            // Mutate
            mutateOneSimulation(newSimulation)
          })
          .catch((err) => {
            Error(errors.updateError, err)
          })
      }
    }

    const subScheme = configuration?.[type]
    setTitle(subScheme ? subScheme.title : 'About')
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
      mutateOneSimulation(newSimulation)
    } catch (err) {
      Error(errors.updateError, err)
    }

    setLoading(false)
    setNeedUpdate(false)
  }

  /**
   * Render
   */
  return (
    <>
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
      <Panel visible={visible} title={title} onClose={onClose}>
        {type === 'about' && (
          <About project={project} simulation={simulation} />
        )}
        {type === 'geometry' && (
          <Geometry project={project} simulation={simulation} part={part} />
        )}
        {type === 'parameters' && (
          <Parameters project={project} simulation={simulation} />
        )}
        {type === 'materials' && (
          <Materials
            project={project}
            simulation={simulation}
            part={part}
            setVisible={setVisible}
          />
        )}
        {type === 'boundaryConditions' && (
          <BoundaryConditions
            project={project}
            simulation={simulation}
            part={part}
            setVisible={setVisible}
          />
        )}
        {type === 'run' && <Run project={project} simulation={simulation} />}
      </Panel>
    </>
  )
}

Simulation.Selector = Selector

export default Simulation
