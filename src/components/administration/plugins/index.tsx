/** @module Components.Administration.Plugins */

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { Checkbox, Table, TableColumnsType } from 'antd'

import { IClientPlugin, ISystem } from '@/database/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import PluginsAPI from '@/api/plugins'
import SystemAPI from '@/api/system'

/**
 * Errors
 */
const errors = {
  plugins: 'Unable to get plugins'
}

/**
 * On change
 * @param system System
 * @param plugin Plugin
 * @param checked Checked
 * @param swr SWR
 */
export const onChange = async (
  system: ISystem,
  plugin: IClientPlugin,
  checked: boolean,
  swr: { mutateSystem: (system: ISystem) => void }
) => {
  try {
    // Update
    const defaultplugins = system?.defaultplugins || []
    const index = defaultplugins.indexOf(plugin.key)
    if (checked && index === -1) {
      defaultplugins.push(plugin.key)
    }
    if (!checked && index !== -1) {
      defaultplugins.splice(index, 1)
    }

    // API
    await SystemAPI.update([
      {
        key: 'defaultplugins',
        value: defaultplugins
      }
    ])

    // Mutate
    swr.mutateSystem({
      defaultplugins
    })
  } catch (err) {
    ErrorNotification(errors.plugins, err)
  }
}

const Plugins = () => {
  // Ref
  const tableRef = useRef(null)

  // State
  const [plugins, setPlugins]: [
    IClientPlugin[],
    Dispatch<SetStateAction<IClientPlugin[]>>
  ] = useState()
  const [scroll, setScroll]: [
    { y: number },
    Dispatch<SetStateAction<{ y: number }>>
  ] = useState()

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
            checked={!!checked}
            onChange={async (e) =>
              onChange(system, plugin, e.target.checked, { mutateSystem })
            }
          />
        )
      }
    }
  ]

  // Update table scroll
  const onResize = useCallback(() => {
    if (
      tableRef.current.clientHeight >
      window.innerHeight - tableRef.current.offsetTop - 59
    ) {
      // Scroll needed
      setScroll({ y: window.innerHeight - tableRef.current.offsetTop - 59 })
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
      columns={columns}
      dataSource={plugins}
      ref={tableRef}
      scroll={scroll}
    />
  )
}

Plugins.propTypes = {}

export default Plugins
