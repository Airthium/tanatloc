/** @module Components.Administration.Plugins */

import {
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Checkbox, Table, TableColumnsType } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { IFrontSystem, IFrontMutateSystem } from '@/api/index.d'
import { ClientPlugin } from '@/plugins/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Utils from '@/lib/utils'

import PluginsAPI from '@/api/plugins'
import SystemAPI from '@/api/system'

/**
 * Props
 */
export interface IPluginProps {
  plugin: ClientPlugin
  system: IFrontSystem
  swr: {
    mutateSystem: (system: IFrontMutateSystem) => Promise<void>
  }
  dispatch: Dispatch<INotificationAction>
}

/**
 * Errors
 */
export const errors = {
  plugins: 'Unable to get plugins',
  update: 'Unable to update system'
}

/**
 * On change
 * @param system System
 * @param plugin Plugin
 * @param checked Checked
 * @param swr SWR
 */
export const _onChange = async (
  system: IFrontSystem,
  plugin: ClientPlugin,
  checked: boolean,
  swr: { mutateSystem: (system: IFrontMutateSystem) => Promise<void> }
): Promise<void> => {
  // API
  await SystemAPI.update([
    {
      key: 'defaultplugins',
      type: 'array',
      method: checked ? 'append' : 'remove',
      value: plugin.key
    }
  ])

  // Local
  const defaultplugins = Utils.deepCopy(system?.defaultplugins ?? [])
  const index: number = defaultplugins.indexOf(plugin.key)
  if (checked && index === -1) {
    defaultplugins.push(plugin.key)
  }
  if (!checked && index !== -1) {
    defaultplugins.splice(index, 1)
  }

  // Mutate
  await swr.mutateSystem({
    defaultplugins
  })
}

/**
 * Plugin
 * @param props Props
 * @returns Plugin
 */
const Plugin = ({ plugin, system, swr, dispatch }: IPluginProps): ReactNode => {
  // State
  const [checked, setChecked] = useState<boolean>()

  // Effect
  useEffect(() => {
    if (system?.defaultplugins) {
      const isChecked = system.defaultplugins.includes(plugin.key)
      setChecked(isChecked)
    }
  }, [plugin, system])

  /**
   * On change
   * @param e Event
   */
  const onChange = useCallback(
    (e: CheckboxChangeEvent): void => {
      const asyncFunction = async () => {
        try {
          await _onChange(system, plugin, e.target.checked, swr)
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        }
      }
      asyncFunction().catch(console.error)
    },
    [plugin, system, swr, dispatch]
  )

  /**
   * Render
   */
  return <Checkbox checked={checked} onChange={onChange} />
}

/**
 * Plugins
 * @returns Plugins
 */
const Plugins = () => {
  // Ref
  const tableRef = useRef<any>(null)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // State
  const [plugins, setPlugins] = useState<ClientPlugin[]>()
  const [scroll, setScroll] = useState<{ y: number } | null>()

  // Data
  const [system, { mutateSystem, loadingSystem }] = SystemAPI.useSystem()

  // Plugins list
  useEffect(() => {
    const asyncFunction = async () => {
      try {
        const list = await PluginsAPI.completeList()

        setPlugins(list)
      } catch (err: any) {
        dispatch(addError({ title: errors.plugins, err }))
      }
    }
    asyncFunction().catch(console.error)
  }, [dispatch])

  /**
   * Render plugin
   * @param plugin Plugin
   * @returns Render
   */
  const renderPlugin = useCallback(
    (plugin: ClientPlugin): ReactNode => (
      <Plugin
        system={system}
        plugin={plugin}
        swr={{ mutateSystem }}
        dispatch={dispatch}
      />
    ),
    [system, mutateSystem, dispatch]
  )

  // Columns
  const columns: TableColumnsType = useMemo(
    () => [
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Default enabled',
        key: 'enable',
        render: renderPlugin
      }
    ],
    [renderPlugin]
  )

  /**
   * On resize
   */
  const onResize = useCallback((): void => {
    const table = tableRef.current
    /* istanbul ignore next */
    if (!table) return
    if (table.clientHeight > window.innerHeight - table.offsetTop - 59) {
      // Scroll needed
      setScroll({ y: window.innerHeight - table.offsetTop - 59 })
    } else {
      // Scroll not needed
      setScroll(null)
    }
  }, [])

  // Handle window resize
  useEffect((): (() => void) => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  // Set Table Scroll Limit
  useEffect(() => {
    onResize()
  }, [plugins, onResize])

  /**
   * Render
   */
  return (
    <Table
      ref={tableRef}
      loading={!plugins || loadingSystem}
      pagination={false}
      size="small"
      columns={columns as TableColumnsType<object>}
      dataSource={plugins}
      scroll={{ y: scroll?.y }}
    />
  )
}

export default Plugins
