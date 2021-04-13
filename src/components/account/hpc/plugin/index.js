import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'

import { Error } from '@/components/assets/notification'

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
    if (errorPlugins) Error(errors.plugins, errorPlugins)
  }, [errorPlugins])

  /**
   * Render
   */
  return loadingPlugins ? (
    <Spin />
  ) : (
    <>
      <PluginDialog plugin={plugin} swr={{ addOnePlugin }} />
      <List
        plugin={plugin}
        plugins={plugins}
        swr={{ delOnePlugin, mutateOnePlugin }}
      />
    </>
  )
}

Plugin.propTypes = {
  plugin: PropTypes.shape({
    key: PropTypes.string.isRequired
  }).isRequired
}

export default Plugin
