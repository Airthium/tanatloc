/** @module Components.Project.Simulation */

import { useState, useEffect, useCallback } from 'react'
import { Layout, Menu, Modal, Select } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { addedDiff, updatedDiff } from 'deep-object-diff'
import { merge } from 'lodash'

import { IClientPlugin } from '@/plugins/index.d'
import { IModel } from '@/models/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import MathJax from '@/components/assets/mathjax'

import Models from '@/models'

import Utils from '@/lib/utils'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem,
  IFrontUser
} from '@/api/index.d'
import SimulationAPI from '@/api/simulation'
import PluginsAPI from '@/api/plugins'

import About from './about'
import Geometry from './geometry'
import Materials from './materials'
import Parameters from './parameters'
import Initialization from './initialization'
import BoundaryConditions from './boundaryConditions'
import Run from './run'
import Postprocessing from './postprocessing'

/**
 * Selector props
 */
export interface ISelectorProps {
  visible: boolean
  user?: Pick<IFrontUser, 'authorizedplugins'>
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
 * Plugins list
 * @param user User
 * @param setModels Set models
 */
export const pluginsList = (
  user: Pick<IFrontUser, 'authorizedplugins'>,
  setModels: (models: IModel[]) => void
) => {
  PluginsAPI.list()
    .then((plugins) => {
      const allModels = loadModels(user, Models, plugins)

      setModels(allModels)
    })
    .catch((err) => {
      ErrorNotification(errors.plugins, err)
    })
}

/**
 * Load models
 * @param user User
 * @param models Models
 * @param plugins Plugins
 */
export const loadModels = (
  user: Pick<IFrontUser, 'authorizedplugins'>,
  models: IModel[],
  plugins: IClientPlugin[]
) => {
  let allModels = models

  plugins.forEach((plugin) => {
    if (
      user?.authorizedplugins?.includes(plugin.key as string) &&
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
  const [current, setCurrent] = useState<IModel>()
  const [loading, setLoading] = useState<boolean>(false)
  const [models, setModels] = useState<IModel[]>([])
  const [categories, setCategories] =
    useState<{ key: string; value: string }[]>()
  const [category, setCategory] = useState<string>()

  // Models
  useEffect(() => {
    user && pluginsList(user, setModels)
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
      setCurrent(Utils.deepCopy(model!))
    },
    [models]
  )

  // Menu items
  const menuItems: ItemType[] = [
    {
      key: 'category',
      disabled: true,
      label: (
        <Select
          className="full-width"
          options={categories}
          allowClear
          showArrow={false}
          placeholder="Category filter"
          onChange={(value) => setCategory(value)}
        />
      )
    }
  ]
  models.forEach((model) => {
    if (!category || model.category === category)
      menuItems.push({ key: model.algorithm, label: model.name })
  })

  /**
   * Render
   */
  return (
    <Modal
      open={visible}
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
          <Menu mode="inline" items={menuItems} onSelect={onSelect} />
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

/**
 * Updater props
 */
export interface IUpdaterProps {
  user?: Pick<IFrontUser, 'authorizedplugins'>
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * On update
 * @param simulation Simulation
 * @param models Models
 * @param swr SWR
 */
export const onUpdate = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  models: IModel[],
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // Current model
    const currentModel = models.find(
      (m) => m.algorithm === simulation?.scheme?.algorithm
    )

    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

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
const Updater = ({
  user,
  simulation,
  swr
}: IUpdaterProps): JSX.Element | null => {
  // State
  const [models, setModels] = useState<IModel[]>([])

  // Models
  useEffect(() => {
    user && pluginsList(user, setModels)
  }, [user])

  // Check model update
  useEffect(() => {
    const currentModel = models.find(
      (m) => m.algorithm === simulation?.scheme?.algorithm
    )
    if (currentModel && simulation?.scheme) {
      const added = addedDiff(simulation.scheme, currentModel)
      const updated = updatedDiff(simulation.scheme, currentModel)

      if (Object.keys(added).length || Object.keys(updated).length) {
        Modal.info({
          title: 'Update',
          content: 'Your model need an update, please wait.',
          closable: false,
          okButtonProps: { hidden: true }
        })
        onUpdate(simulation, models, swr).finally(() => Modal.destroyAll())
      }
    }
  }, [simulation, models, swr])

  /**
   * Render
   */
  return null
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
  Run,
  Postprocessing
}

export default Simulation
