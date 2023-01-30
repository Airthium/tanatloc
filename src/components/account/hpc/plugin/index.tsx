/** @module Components.Account.HPC.Plugin */

import { useEffect } from 'react'
import { Space, Spin } from 'antd'

import { IClientPlugin } from '@/plugins/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'

import PluginDialog from './dialog'
import List from './list'

import { globalStyle } from '@/styles'

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
const Plugin = ({ plugin }: IProps): JSX.Element => {
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

  // Plugins errors
  useEffect(() => {
    if (errorPlugins) ErrorNotification(errors.plugins, errorPlugins)
  }, [errorPlugins])

  /**
   * Render
   */
  if (loadingPlugins) return <Spin />
  return (
    <Space direction="vertical" css={globalStyle.fullWidth}>
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
