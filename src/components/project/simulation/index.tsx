/** @namespace Components.Project.Simulation */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Layout, Menu, Modal, Select, Space, Typography } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { addedDiff, updatedDiff } from 'deep-object-diff'
import merge from 'lodash.merge'
import { MathJax } from 'better-react-mathjax'

import { IUserWithData } from '@/lib/index.d'
import { IClientPlugin, ISimulation } from '@/database/index.d'
import { IModel } from '@/models/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'

import About from './about'
import Geometry from './geometry'
import Materials from './materials'
import Parameters from './parameters'
import Initialization from './initialization'
import BoundaryConditions from './boundaryConditions'
import Run from './run'

import SimulationAPI from '@/api/simulation'
import PluginsAPI from '@/api/plugins'

import Models from '@/models'

export interface ISelectorProps {
  visible: boolean
  user?: IUserWithData
  onOk: Function
  onCancel: Function
}

/**
 * Errors
 * @memberof Components.Project.Simulation
 */
const errors = {
  plugins: 'Unable to load plugins',
  update: 'Unable to update the simulation'
}

/**
 * Load models
 * @memberof Components.Project.Simulation
 * @param {Object} user User
 * @param {Object} models Models
 * @param {Object} plugins Plugins
 */
const loadModels = (
  user: IUserWithData,
  models: IModel[],
  plugins: IClientPlugin[]
) => {
  let allModels = models

  plugins.forEach((plugin) => {
    if (
      user?.authorizedplugins?.includes(plugin.key) &&
      plugin.category === 'Model'
    )
      allModels = [...allModels, ...plugin.models]
  })

  return allModels
}

/**
 * Simulation Selector
 * @memberof Components.Project.Simulation
 * @param {Object} props Props `{ user, visible, onOk, onCancel }`
 */
const Selector = ({
  visible,
  user,
  onOk,
  onCancel
}: ISelectorProps): JSX.Element => {
  // State
  const [current, setCurrent]: [IModel, Function] = useState()
  const [loading, setLoading]: [boolean, Function] = useState(false)
  const [models, setModels]: [IModel[], Function] = useState([])
  const [category, setCategory]: [string, Function] = useState()

  // Models
  useEffect(() => {
    if (!user) return

    PluginsAPI.list()
      .then((plugins) => {
        const allModels = loadModels(user, Models, plugins)

        setModels(allModels)
      })
      .catch((err) => {
        ErrorNotification(errors.plugins, err)
      })
  }, [user])

  /**
   * On select
   * @param data Data
   */
  const onSelect = ({ key }: { key: string }): void => {
    const model = models.find((m) => m.algorithm === key)
    setCurrent({ ...model })
  }

  /**
   * On create
   */
  const onCreate = async (): Promise<void> => {
    setLoading(true)
    if (current) onOk(current)
    setLoading(false)
  }

  const categories = models
    .map((m) => m.category)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((c) => ({ key: c, value: c }))

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
      onCancel={() => onCancel()}
      width="80%"
    >
      <Layout>
        <Layout.Sider theme="light">
          <Menu mode="inline" onSelect={onSelect}>
            <Select
              options={categories}
              allowClear
              placeholder="Category filter"
              onChange={(value) => setCategory(value)}
            />
            {models.map((model) => {
              if (!category || model.category === category)
                return <Menu.Item key={model.algorithm}>{model.name}</Menu.Item>
            })}
          </Menu>
        </Layout.Sider>
        <Layout.Content
          style={{ padding: '10px' }}
          className="simulation-selector"
        >
          <MathJax dynamic>
            <div dangerouslySetInnerHTML={{ __html: current?.description }} />
          </MathJax>
        </Layout.Content>
      </Layout>
    </Modal>
  )
}

Selector.propTypes = {
  user: PropTypes.shape({
    authorizedplugins: PropTypes.array
  }),
  visible: PropTypes.bool,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export interface IUpdaterProps {
  user?: IUserWithData
  simulation?: ISimulation
  swr: {
    mutateOneSimulation: Function
  }
}

/**
 * Simulation Updater
 * @memberof Components.Project.Simulation
 * @param {Object} props Props `{ user, simulation, swr }`
 */
const Updater = ({ user, simulation, swr }: IUpdaterProps): JSX.Element => {
  // State
  const [needUpdate, setNeedUpdate]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)
  const [models, setModels]: [IModel[], Function] = useState([])

  // Models
  useEffect(() => {
    if (!user) return

    PluginsAPI.list()
      .then((plugins) => {
        const allModels = loadModels(user, Models, plugins)
        setModels(allModels)
      })
      .catch((err) => {
        ErrorNotification(errors.plugins, err)
      })
  }, [user])

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
   * On update
   */
  const onUpdate = async (): Promise<void> => {
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
      ErrorNotification(errors.update, err)
    } finally {
      setLoading(false)
      setNeedUpdate(false)
    }
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
        okText="OK"
        confirmLoading={loading}
        onCancel={() => setNeedUpdate(false)}
        cancelButtonProps={{ disabled: true }}
        maskClosable={false}
      >
        <Space direction="vertical">
          <Typography.Text>Your model needs an update!</Typography.Text>
          <Typography.Text strong>Update now?</Typography.Text>
        </Space>
      </Modal>
    )
}

Updater.propTypes = {
  user: PropTypes.exact({
    authorizedplugins: PropTypes.array
  }),
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

const Simulation = {
  Selector,
  Updater,
  About,
  Geometry,
  Materials,
  Parameters,
  Initialization,
  BoundaryConditions,
  Run
}

export default Simulation
