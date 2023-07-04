/** @module Components.Account.HPC.Plugin */

import { useContext, useEffect } from 'react'
import { Space, Spin } from 'antd'

import { IClientPlugin } from '@/plugins/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import PluginAPI from '@/api/plugin'

import PluginDialog from './dialog'
import List from './list'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  plugin: IClientPlugin
}

/**
 * Errors
 */
export const errors = {
  plugins: 'Error while loading plugins'
}

/**
 * Plugin
 * @param props Props
 * @returns Plugin
 */
const Plugin = ({ plugin }: IProps): React.JSX.Element => {
  // Data
  const [
    plugins,
    {
      addOnePlugin,
      delOnePlugin,
      mutateOnePlugin,
      errorPlugins,
      loadingPlugins
    }
  ] = PluginAPI.usePlugins()

  const { dispatch } = useContext(NotificationContext)

  // Plugins errors
  useEffect(() => {
    if (errorPlugins)
      dispatch(addError({ title: errors.plugins, err: errorPlugins }))
  }, [errorPlugins, dispatch])

  /**
   * Render
   */
  if (loadingPlugins) return <Spin />
  return (
    <Space direction="vertical" className={globalStyle.fullWidth}>
      <PluginDialog
        plugin={{
          uuid: plugin.uuid,
          key: plugin.key,
          name: plugin.name,
          description: plugin.description,
          haveInit: plugin.haveInit,
          configuration: plugin.configuration,
          inUseConfiguration: plugin.inUseConfiguration
        }}
        swr={{ addOnePlugin }}
      />
      <List
        plugin={{ key: plugin.key }}
        plugins={plugins}
        swr={{ delOnePlugin, mutateOnePlugin }}
      />
    </Space>
  )
}

export default Plugin
