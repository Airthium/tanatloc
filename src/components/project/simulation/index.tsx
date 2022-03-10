/** @module Components.Project.Simulation */

import PropTypes from 'prop-types'
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback
} from 'react'
import { Layout, Menu, Modal, Select, Space, Typography } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { addedDiff, updatedDiff } from 'deep-object-diff'
import { merge } from 'lodash'

import { IUserWithData } from '@/lib/index.d'
import { IClientPlugin, ISimulation } from '@/database/index.d'
import { IModel } from '@/models/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import MathJax from '@/components/assets/mathjax'

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

/**
 * Selector props
 */
export interface ISelectorProps {
  visible: boolean
  user?: IUserWithData
  onOk: (model: IModel) => Promise<void>
  onCancel: () => void
}

/**
 * Errors
 */
export const errors = {
  plugins: 'Unable to load plugins',
  update: 'Unable to update the simulation'
}

/**
 * Load models
 * @param user User
 * @param models Models
 * @param plugins Plugins
 */
export const loadModels = (
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
 * @param props Props
 * @returns Simulation.Selector
 */
const Selector = ({
  visible,
  user,
  onOk,
  onCancel
}: ISelectorProps): JSX.Element => {
  // State
  const [current, setCurrent]: [IModel, Dispatch<SetStateAction<IModel>>] =
    useState()
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [models, setModels]: [IModel[], Dispatch<SetStateAction<IModel[]>>] =
    useState([])
  const [categories, setCategories]: [
    { key: string; value: string }[],
    Dispatch<SetStateAction<{ key: string; value: string }[]>>
  ] = useState()
  const [category, setCategory]: [string, Dispatch<SetStateAction<string>>] =
    useState()

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

  // Categories
  useEffect(() => {
    // Categories
    const newCategories = models
      .map((m) => m.category)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((c) => ({ key: c, value: c }))

    setCategories(newCategories)
  }, [models])

  /**
   * On select
   * @param data Data
   */
  const onSelect = useCallback(
    ({ key }: { key: string }): void => {
      const model = models.find((m) => m.algorithm === key)
      setCurrent({ ...model })
    },
    [models]
  )

  /**
   * Render
   */
  return (
    <Modal
      visible={visible}
      title="Create simulation"
      okText="Create"
      okButtonProps={{ loading: loading }}
      onOk={async () => {
        setLoading(true)
        if (current)
          try {
            await onOk(current)
          } catch (err) {}
        setLoading(false)
      }}
      onCancel={() => onCancel()}
      width="80%"
    >
      <Layout>
        <Layout.Sider theme="light">
          <Menu mode="inline" onSelect={onSelect}>
            <Menu.Item disabled>
              <Select
                className="full-width"
                options={categories}
                allowClear
                showArrow={false}
                placeholder="Category filter"
                onChange={(value) => setCategory(value)}
              />
            </Menu.Item>
            {models.map((model) => {
              if (!category || model.category === category)
                return <Menu.Item key={model.algorithm}>{model.name}</Menu.Item>
            })}
          </Menu>
        </Layout.Sider>
        <Layout.Content
          style={{ padding: '20px', height: '60vh', overflow: 'auto' }}
          className="simulation-selector"
        >
          <MathJax.Html html={current?.description} />
        </Layout.Content>
      </Layout>
    </Modal>
  )
}

Selector.propTypes = {
  user: PropTypes.exact({
    authorizedplugins: PropTypes.array
  }),
  visible: PropTypes.bool,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

/**
 * Updater props
 */
export interface IUpdaterProps {
  user?: IUserWithData
  simulation?: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * On update
 * @param simulation Simulation
 * @param models Models
 * @param swr SWR
 */
export const onUpdate = async (
  simulation: ISimulation,
  models: IModel[],
  swr: { mutateOneSimulation: (simulation: ISimulation) => void }
): Promise<void> => {
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
  }
}

/**
 * Simulation Updater
 * @param props Props
 * @return Simulation.Updater
 */
const Updater = ({ user, simulation, swr }: IUpdaterProps): JSX.Element => {
  // State
  const [needUpdate, setNeedUpdate]: [
    boolean,
    Dispatch<SetStateAction<boolean>>
  ] = useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [models, setModels]: [IModel[], Dispatch<SetStateAction<IModel[]>>] =
    useState([])

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
        onOk={async () => {
          setLoading(true)
          try {
            await onUpdate(simulation, models, swr)
          } finally {
            setLoading(false)
            setNeedUpdate(false)
          }
        }}
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
  simulation: PropTypes.exact({
    id: PropTypes.string,
    scheme: PropTypes.object
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
