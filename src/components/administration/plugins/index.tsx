/** @module Components.Administration.Plugins */

import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Checkbox, Table, TableColumnsType } from 'antd'

import { IClientPlugin } from '@/plugins/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import PluginsAPI from '@/api/plugins'
import SystemAPI from '@/api/system'
import { IFrontSystem } from '@/api/index.d'

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
export const onChange = async (
  system: IFrontSystem,
  plugin: IClientPlugin,
  checked: boolean,
  swr: { mutateSystem: (system: Partial<IFrontSystem>) => void }
) => {
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
 * Plugins
 * @returns Plugins
 */
const Plugins = () => {
  // Ref
  const tableRef = useRef(null)

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

  // Columns
  const columns: TableColumnsType = [
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
      render: (plugin) => {
        const checked = system?.defaultplugins?.includes(plugin.key)
        return (
          <Checkbox
            checked={checked}
            onChange={async (e) =>
              onChange(system as IFrontSystem, plugin, e.target.checked, {
                mutateSystem
              })
            }
          />
        )
      }
    }
  ]

  // Update table scroll
  const onResize = useCallback(() => {
    const table = tableRef.current as RefObject<HTMLDivElement>['current']
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

Plugins.propTypes = {}

export default Plugins
