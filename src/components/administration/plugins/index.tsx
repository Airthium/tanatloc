/** @module Components.Administration.Plugins */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Checkbox, Table, TableColumnsType } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { IFrontSystem, IFrontMutateSystem } from '@/api/index.d'
import { IClientPlugin } from '@/plugins/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import PluginsAPI from '@/api/plugins'
import SystemAPI from '@/api/system'

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
  plugin: IClientPlugin,
  checked: boolean,
  swr: { mutateSystem: (system: IFrontMutateSystem) => void }
): Promise<void> => {
  try {
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
    const defaultplugins = system?.defaultplugins || []
    const index: number = defaultplugins.indexOf(plugin.key as string)
    if (checked && index === -1) {
      defaultplugins.push(plugin.key as string)
    }
    if (!checked && index !== -1) {
      defaultplugins.splice(index, 1)
    }

    // Mutate
    swr.mutateSystem({
      defaultplugins
    })
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * Plugin
 * @param props Props
 * @returns Plugin
 */
const Plugin = ({
  plugin,
  system,
  swr
}: {
  plugin: IClientPlugin
  system: IFrontSystem
  swr: {
    mutateSystem: (system: IFrontMutateSystem) => void
  }
}): JSX.Element => {
  // State
  const [checked, setChecked] = useState<boolean>()

  // Effect
  useEffect(() => {
    if (system?.defaultplugins) {
      const isChecked = system.defaultplugins.includes(plugin.key!)
      setChecked(isChecked)
    }
  }, [plugin, system])

  /**
   * On change
   * @param e Event
   */
  const onChange = useCallback(
    async (e: CheckboxChangeEvent) =>
      _onChange(system, plugin, e.target.checked, swr),
    [plugin, system, swr]
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
  const tableRef = useRef<HTMLDivElement>(null)

  // State
  const [plugins, setPlugins] = useState<IClientPlugin[]>()
  const [scroll, setScroll] = useState<{ y: number } | null>()

  // Data
  const [system, { mutateSystem, loadingSystem }] = SystemAPI.useSystem()

  // Plugins list
  useEffect(() => {
    PluginsAPI.completeList()
      .then((list) => {
        setPlugins(list)
      })
      .catch((err) => {
        ErrorNotification(errors.plugins, err)
      })
  }, [])

  /**
   * Render plugin
   * @param plugin Plugin
   * @returns Render
   */
  const renderPlugin = useCallback(
    (plugin: IClientPlugin): JSX.Element => (
      <Plugin system={system} plugin={plugin} swr={{ mutateSystem }} />
    ),
    [system, mutateSystem]
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
  const onResize = useCallback(() => {
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
      loading={!plugins || loadingSystem}
      pagination={false}
      size="small"
      columns={columns as TableColumnsType<object>}
      dataSource={plugins}
      ref={tableRef}
      scroll={{ y: scroll?.y }}
    />
  )
}

export default Plugins
