/** @module Components.Account.HPC.Plugin */

import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Space, Spin } from 'antd'

import { IClientPlugin } from '@/database/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginDialog from './dialog'
import List from './list'

import PluginAPI from '@/api/plugin'

export interface IProps {
  plugin: IClientPlugin
}

/**
 * Errors
 * @memberof Components.Account.HPC.Plugin
 */
const errors = {
  plugins: 'Plugins error'
}

/**
 * Plugin
 * @memberof Components.Account.HPC.Plugin
 * @param props Props
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
  else
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <PluginDialog
          plugin={{
            uuid: plugin.uuid,
            key: plugin.key,
            name: plugin.name,
            needInit: plugin.needInit,
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

Plugin.propTypes = {
  plugin: PropTypes.exact({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    needInit: PropTypes.bool,
    configuration: PropTypes.object.isRequired,
    inUseConfiguration: PropTypes.object
  }).isRequired
}

export default Plugin
