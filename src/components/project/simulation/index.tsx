/** @module Components.Project.Simulation */

import { useState, useCallback, useMemo, useContext } from 'react'
import {
  Layout,
  Menu,
  MenuProps,
  Modal,
  Select,
  Tabs,
  Tooltip,
  Typography
} from 'antd'
import { addedDiff, updatedDiff } from '@airthium/deep-object-diff'
import { merge } from 'lodash'

import { ClientPlugin } from '@/plugins/index.d'
import { IModel } from '@/models/index.d'
import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem,
  IFrontUser,
  IFrontUserModel
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'
import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import MathJax from '@/components/assets/mathjax'
import { DeleteButton } from '@/components/assets/button'

import Models from '@/models'

import Utils from '@/lib/utils'
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

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

/**
 * Selector props
 */
export interface ISelectorProps {
  visible: boolean
  user: Pick<IFrontUser, 'id' | 'authorizedplugins' | 'usermodels'>
  title?: string
  okText?: string
  onOk: (userModel: IFrontUserModel) => Promise<void>
  onCancel: () => void
  onDelete?: (index: number) => Promise<void>
}

/**
 * Errors
 */
export const errors = {
  plugins: 'Unable to load plugins',
  update: 'Unable to update simulation'
}

/**
 * Plugins list
 * @param user User
 */
export const _pluginsList = async (
  user: Pick<IFrontUser, 'authorizedplugins'>
): Promise<IModel[]> => {
  const list = await PluginsAPI.list()

  return _loadModels(user, Models, list)
}

/**
 * Load models
 * @param user User
 * @param models Models
 * @param plugins Plugins
 */
export const _loadModels = (
  user: Pick<IFrontUser, 'authorizedplugins'>,
  models: IModel[],
  plugins: ClientPlugin[]
): IModel[] => {
  let allModels = models

  plugins.forEach((plugin) => {
    if (
      user.authorizedplugins?.includes(plugin.key) &&
      plugin.category === 'Model'
    )
      allModels = [...allModels, ...plugin.models]
  })

  return allModels
}

/**
 * Is in categories
 * @param modelCategory Model category(ies)
 * @param categories Categories
 * @returns True / false
 */
export const _isInCategories = (
  modelCategory: string | string[],
  categories?: string[]
): boolean => {
  if (!categories?.length) return true

  if (Array.isArray(modelCategory)) {
    const found = categories.filter((c) => modelCategory.includes(c))
    if (found.length == categories.length) return true
    return false
  } else {
    if (categories.length === 1 && categories.includes(modelCategory))
      return true
    return false
  }
}

/**
 * Simulation Selector
 * @param props Props
 * @returns Simulation.Selector
 */
const Selector: React.FunctionComponent<ISelectorProps> = ({
  visible,
  user,
  title,
  okText,
  onOk,
  onCancel,
  onDelete
}) => {
  // State
  const [key, setKey] = useState<string>()
  const [current, setCurrent] = useState<IFrontUserModel>()
  const [loading, setLoading] = useState<boolean>(false)
  const [models, setModels] = useState<IModel[]>([])
  const [categories, setCategories] = useState<string[]>([])

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Models
  useCustomEffect(
    () => {
      asyncFunctionExec(async () => {
        try {
          const newModels = await _pluginsList(user)
          setModels(newModels)
        } catch (err: any) {
          dispatch(addError({ title: errors.plugins, err }))
          setModels([])
        }
      })
    },
    [user],
    [dispatch]
  )

  // Categories
  const availableCategories: { key: string; value: string }[] = useMemo(() => {
    const newCategories = models
      .map((m) => m.category)
      .flat()
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((c) => ({ key: c, value: c }))

    return newCategories
  }, [models])

  /**
   * On Tanatloc select
   * @param data Data
   */
  const onTanatlocSelect = useCallback(
    ({ key }: { key: string }): void => {
      setKey(key)
      const model = models.find((m) => m.algorithm === key)
      setCurrent({ model: model! } as IFrontUserModel)
    },
    [models]
  )

  /**
   * On User select
   * @param data Data
   */
  const onUserSelect = useCallback(
    ({ key }: { key: string }): void => {
      const algorithm = key.split('&').pop()
      setKey(algorithm)
      const userModel = user.usermodels.find(
        (usermodel) => usermodel.model.algorithm === algorithm
      )!
      setCurrent(Utils.deepCopy(userModel))
    },
    [user]
  )

  /**
   * On modal ok
   */
  const onModalOk = useCallback((): void => {
    asyncFunctionExec(async () => {
      setLoading(true)
      if (current)
        try {
          await onOk(current)
        } catch (err) {}
      setLoading(false)
      setCurrent(undefined)
      setKey(undefined)
    })
  }, [current, onOk])

  /**
   * On model cancel
   */
  const onModalCancel = useCallback((): void => {
    setCurrent(undefined)
    setKey(undefined)
    onCancel()
  }, [onCancel])

  // Menu items (Tanatloc)
  const tanatlocMenuItems = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: 'category',
        disabled: true,
        label: (
          <Select
            mode="multiple"
            className={globalStyle.fullWidth}
            options={availableCategories}
            allowClear
            suffixIcon={null}
            placeholder="Category filter"
            onChange={setCategories}
            value={categories}
            style={{ textOverflow: 'ellipsis' }}
          />
        )
      }
    ]

    models.forEach((model) => {
      if (_isInCategories(model.category, categories))
        items.push({
          key: model.algorithm,
          label: model.name
        })
    })

    return items
  }, [models, availableCategories, categories])

  // Menu items (user)
  const userMenuItems = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: 'category',
        disabled: true,
        label: (
          <Select
            mode="multiple"
            className={globalStyle.fullWidth}
            options={availableCategories}
            allowClear
            suffixIcon={null}
            placeholder="Category filter"
            onChange={setCategories}
            value={categories}
          />
        )
      }
    ]

    user.usermodels.forEach((usermodel, index) => {
      if (_isInCategories(usermodel.model.category, categories))
        items.push({
          key: usermodel.id + '&' + usermodel.model.algorithm,
          label: (
            <>
              {onDelete ? (
                <DeleteButton onDelete={async () => onDelete(index)} />
              ) : null}
              <Tooltip title={usermodel.model.name}>
                <Typography.Text ellipsis={true}>
                  {usermodel.model.name}
                </Typography.Text>
              </Tooltip>
              {usermodel.owners.find((owner) => owner.id === user.id) ? null : (
                <div className="shared">
                  {Utils.userToAvatar(usermodel.owners[0])}
                </div>
              )}
            </>
          )
        })
    })

    return items
  }, [user, availableCategories, categories, onDelete])

  /**
   * Render
   */
  return (
    <Modal
      open={visible}
      title={title ?? 'Create simulation'}
      okText={okText ?? 'Create'}
      okButtonProps={{ loading: loading }}
      onOk={onModalOk}
      onCancel={onModalCancel}
      width="80%"
    >
      <Layout className={style.selectorContent}>
        <Layout.Sider theme="light" width={300} className={style.selectorSider}>
          <Tabs
            defaultActiveKey="tanatloc"
            items={[
              {
                key: 'tanatloc',
                label: 'Tanatloc algorithm',
                children: (
                  <Menu
                    selectedKeys={key ? [key] : undefined}
                    mode="inline"
                    items={tanatlocMenuItems}
                    onClick={onTanatlocSelect}
                  />
                )
              },
              {
                key: 'personal',
                label: 'User algorithm',
                children: (
                  <Menu
                    selectedKeys={key ? [key] : undefined}
                    mode="inline"
                    className={style.userMenu}
                    items={userMenuItems}
                    onClick={onUserSelect}
                  />
                )
              }
            ]}
          />
        </Layout.Sider>
        <Layout.Content className={style.selector}>
          <MathJax.Html html={current?.model.description} />
        </Layout.Content>
      </Layout>
    </Modal>
  )
}

/**
 * Updater props
 */
export interface IUpdaterProps {
  user: Pick<IFrontUser, 'authorizedplugins'>
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

/**
 * On update
 * @param simulation Simulation
 * @param models Models
 * @param swr SWR
 */
export const _onUpdate = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  models: IModel[],
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
): Promise<void> => {
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
  await swr.mutateOneSimulation(newSimulation)
}

/**
 * Simulation Updater
 * @param props Props
 * @return Simulation.Updater
 */
const Updater: React.FunctionComponent<IUpdaterProps> = ({
  user,
  simulation,
  swr
}) => {
  // State
  const [models, setModels] = useState<IModel[]>([])

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Models
  useCustomEffect(
    () => {
      asyncFunctionExec(async () => {
        try {
          const newModels = await _pluginsList(user)
          setModels(newModels)
        } catch (err: any) {
          dispatch(addError({ title: errors.plugins, err }))
          setModels([])
        }
      })
    },
    [user],
    [dispatch]
  )

  // Check model update
  useCustomEffect(() => {
    const currentModel = models.find(
      (m) => m.algorithm === simulation?.scheme?.algorithm
    )
    if (currentModel && simulation?.scheme) {
      const added = addedDiff(simulation.scheme, currentModel, {
        excludedKeys: ['value', 'unit']
      })
      const updated = updatedDiff(simulation.scheme, currentModel, {
        excludedKeys: ['value', 'unit']
      })

      if (Object.keys(added).length || Object.keys(updated).length) {
        Modal.info({
          title: 'Update',
          content: 'Your model need an update, please wait.',
          closable: false,
          okButtonProps: { hidden: true }
        })
        _onUpdate(simulation, models, swr)
          .catch((err) => {
            dispatch(addError({ title: errors.update, err }))
          })
          .finally(() => Modal.destroyAll())
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
