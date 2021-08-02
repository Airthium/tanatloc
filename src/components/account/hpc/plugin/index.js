import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Space, Spin } from 'antd'

import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginDialog from './dialog'
import List from './list'

import PluginAPI from '@/api/plugin'

/**
 * Errors account/plugins
 * @memberof module:components/account
 */
const errors = {
  plugins: 'Plugins error'
}

/**
 * Plugin
 * @memberof module:components/account
 * @param {Object} props Props
 */
const Plugin = ({ plugin }) => {
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
  return loadingPlugins ? (
    <Spin />
  ) : (
    <Space direction="vertical" style={{ width: '100%' }}>
      <PluginDialog
        plugin={{
          uuid: plugin.uuid,
          key: plugin.key,
          name: plugin.name,
          needInit: plugin.needInit,
          configuration: plugin.configuration
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
    configuration: PropTypes.object.isRequired
  }).isRequired
}

export default Plugin
